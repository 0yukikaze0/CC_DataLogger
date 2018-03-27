const fs        = require('fs');
const Worker    = require('../workers/BittrexWorker');

/**
 * Logs pricing data from Bittrex
 */
class BittrexLogger{
    constructor(config, cfgPath){
        this._cfg       = config;
        this._cfgFile   = cfgPath;
        this._workers   = {};
    }

    execute(){
        this.parseConfig()
            .then(() => this.attachFileWatch());

    }

    createWorkerFor(coinPair){
        console.log(`       +- Creating worker for [${coinPair}]`)
        let worker = new Worker(coinPair, this._cfg.url, this._cfg.logDir, this._cfg.interval);
        worker.start();
        this._workers[coinPair] = worker;
    }

    parseConfig(){
        return new Promise((resolve, reject) => {
            try {
                let parse = JSON.parse(fs.readFileSync(this._cfgFile));
                /**
                 * [1]-> Check if a worker already exists for this coin pair. Skip if yes
                 * [2]-> Create a worker
                 * [3]-> Register worker to current tracked
                 */
                parse.coins.forEach(coinPair => {
                    if (this._workers[coinPair] === undefined) {
                        this.createWorkerFor(coinPair);
                    } else {
                        console.log(`       +- [SKIP] - [${coinPair}] Worker exists`);
                    }
                });
            } catch (e) {
                console.log('       +- File parse failed!');
                console.log(e)
            } finally {
                resolve();
            }
        });
    }

    attachFileWatch(){
        fs.watchFile(this._cfgFile, (current, previous) => {
            console.log('       +- Changes detected in file');
            this.parseConfig()
        })
    }
}

module.exports = BittrexLogger;