const Worker = require('./Worker');

class BittrexWorker extends Worker{

    constructor(coinPair, url, logToDir, interval){
        super(coinPair, url, logToDir, interval);
    }

    _parseResponse(response, date){
        try {
            /**
             * [1]-> If success = false -> Return null
             * [2]-> Pick first element from below paths 
             *          -> result.buy[0]
             *          -> result.sell[0]
             * [3]-> Forward to logger
             */
            // [1]
            if(!response.success){
                return;
            }

            // [2]
            let stub = {
                time: {
                    timeStamp : date.getTime(),
                    isoString : date.toISOString()
                },
                payload : {
                    buy : response.result.buy[0],
                    sell : response.result.sell[0]
                }
            }
                        
            this._logData(JSON.stringify(stub), date);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = BittrexWorker;