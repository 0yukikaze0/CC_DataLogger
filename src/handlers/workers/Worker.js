const fs        = require('fs');
const os        = require('os');
const request   = require('request-promise');

/**
 * Generic worker class.
 * To be extended by other niche workers
 */
class Worker{
    constructor(coinPair, url, logToDir, interval){
        this.configure(coinPair, url, logToDir, interval);
    }

    configure(coinPair, url, logToDir, interval){
        this._coinPair  = coinPair;
        this._logToDir  = `${logToDir}/${coinPair}`;
        
        if (!fs.existsSync(`${this._logToDir}`)) {
            fs.mkdirSync(`${this._logToDir}`)
        }
        
        this._active    = false;
        this._timer     = null;

        this._url = url;
        this._options = {
            uri: this._url,
            qs: {
                type: 'both',
                market: coinPair
            },
            json: true
        }

        /**
         * If no interval is provided, default to 1 second
         * Note: Some API's might cap the number of requests per minute
         */
        if(interval === undefined){
            this._interval = 1000;
        } else {
            this._interval = interval;
        }
    }

    start(){
        console.log('   +- Worker active ');
        /**
         * Configure and trigger a timer
         */
        this._timer = setInterval(()=>{this._transmitRequest()}, this._interval);
    }

    /**
     * Transmits an ajax request, and forwards it to parse function
     * Note : For niche parsing, _parseResponse method would be overridden 
     */
    _transmitRequest(){
        // Timestamp for this request
        let date = new Date();
        let logString = '';
        request(this._options)
            .then((result) => this._parseResponse(result, date))
            .catch((e) => console.log(e))
    }

    /** To be overriden by implementer class */
    _parseResponse(response, date){}

    _logData(logString, date){
        /**
         * Log files are rotated every one hour
         *  -> Logs will be organized in folders by date
         *  -> Log file naming <coinName>-<date>-<time>
         * 
         * Specs:
         *  -> At a log interval of per second, we are looking at 3600 records per file
         *  -> This is in the ballpark figure of 3 MB
         */
        
        let folderName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        let fileName = `${this._coinPair}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`
        if(!fs.existsSync(`${this._logToDir}/${folderName}`)){
            fs.mkdirSync(`${this._logToDir}/${folderName}`)
        }
        fs.appendFileSync(`${this._logToDir}/${folderName}/${fileName}`, logString + os.EOL);
    }

    terminate(){
        this._timer.cancel();
    }
}

module.exports = Worker;