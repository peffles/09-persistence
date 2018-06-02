'use strict';

const logger = require('../lib/logger');
const Store = require('../model/store');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeStore(router) {
  router.post('/api/v1/store', (req, res) => {
    logger.log(logger.INFO, 'PAINTING-ROUTE: POST /api/v1/store');
    try {
      const newStore = new Store(req.body.title, req.body.content);
      storage.create('Store', newStore)
        .then((store) => {
          response.sendJSON(res, 201, store);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `STORE-ROUTE | There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/store', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Store', req.url.query.id)
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));

          response.sendText(res, 404, err.message);
        });
    } else {
      storage.fetchAll('Store')
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          response.sendText(res, 404, err.message);
        });
    }
  });
  router.delete('/api/v1/store', (req, res) => {
    storage.delete('Store', req.url.query.id)
      .then(() => {
        response.sendText(res, 204, 'No content in the body');
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, 'Resource not found');
        return undefined;
      });
    return undefined;
  });
};
