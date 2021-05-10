'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const {
  DEFAULT_PORT,
  HttpCode,
  API_PREFIX,
} = require(`../../constants`);


const app = express();
const logger = getLogger({name: `api`});


app.use(express.json());
app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Route not found ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occured on server creation: ${err.message}`);
        }
        return logger.info(chalk.green(`Listening to connections on ${port}`));
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
  }
};
