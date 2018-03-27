# Trade data logger
Logs data from various exchanges. Data is logged as JSON strings which could then be used as a time series dataset for back testing of trading strategies and other algorithms

## Categorization of data file

Workers generate log files which are rotated on below rules

- Log files are rotated per hour
- Files will be stored in `<logDir>/<coinName>/<coinName>-<date>-<hour>`

## Configuration

All configuration goes into config/default.json

Exchange specific configuration goes into `<exchangename>.json`

Example configuration provided for bittrex.

## Execution Instruction
- Clone repository
- Run `npm install`
- Run `node Application`

## Addition of new coins to watch

### NOTE: Example below considers bittrex
### NOTE : Bittrex coin pairs are denoted as `<settlementCurrency>-<targetCurrency>`. For example, `BTC-XRP`
### NOTE : Please make sure JSON is valid

- New coin pairs can be added to the watchlist without stopping the application
- Open ./config/bittrex.json
- Add your coin pair to coins array
- Save config file
- Application will detect the new addition and start logging data for that coin