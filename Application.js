const fs            = require('fs');
const config        = require('config');

/**
 * TODO :   Build dynamic imports for worker classes
 *          Current implementation using static imports and references from watch.json
 *          Future implementations should resolve classes via a file watch on watch.json
 */
const Bittrex       = require('./src/handlers/bittrex/BittrexLogger');

const classes = {
    'bittrex' : Bittrex
}

class Application{

    constructor(){
        this._cfg           = config.get('app');
        this._activeLoggers = {}
    }

    /**
     * Entry method
     */
    execute(){
        let obj = JSON.parse(fs.readFileSync(this._cfg.watchFile));
        console.log(`   [+]- Found ${obj.list.length} logger configurations`);
        obj.list.forEach(fileName => {
            let elConfig = JSON.parse(fs.readFileSync(fileName));
            console.log(`       +- Attempting ${fileName}`);
            this.createLoggerFor(elConfig, fileName);
        });
    }

    /**
     * Creates a data logger for provided configuration
     * @param {string} loggerConfig 
     */
    createLoggerFor(loggerConfig, cfgPath){
        /**
         * [1]-> Check if this logger already exists. Skip if yes
         * [2]-> Acquire source class and instantiate
         * [3]-> Execute and register into current logger list
         */
        // [1]
        if(this._activeLoggers[loggerConfig.name] === undefined){
            try{
                this._activeLoggers[loggerConfig.name] = new classes[loggerConfig.name](loggerConfig, cfgPath);
                console.log(`       +- Executing ${loggerConfig.name}`);
                this._activeLoggers[loggerConfig.name].execute();
            }catch(e){console.log(e)}

        } else {
            console.log('   +- [SKIP] -> Logger already active');
        }
    }

    /**
     * Attaches a file watch on the listing file
     */
    attachFileWatch(){
        // TODO
    }

    /**
     * Terminates all active handlers
     */
    terminate(){
        this._activeHandlers.forEach(handlerName => {
            console.log('   +- Terminating ' + handlerName)
            this._activeHandlers[handlerName].terminate();
        });
    }
}

new Application().execute();