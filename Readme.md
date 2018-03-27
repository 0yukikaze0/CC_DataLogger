# Trade data logger
Logs data from various exchanges. Data is logged as JSON strings which could then be used as a time series dataset for back testing of trading strategies and other algorithms

## Categorization of data file

Workers generate log files which are rotated on below rules

- Log files are rotated per hour
- Files will be stored in [logDir]/[coinName][date]

## Configuration

All configuration goes into config/default.json