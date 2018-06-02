'use strict';

const logger = require('./logger');

const storage = module.exports = {};
const memory = {};

storage.create = function create(schema, item) {
  logger.log(logger.INFO, 'Created a new resource in storage');
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('Schema required!'));
    if (!item) return reject(new Error('Item required!'));
    if (!memory[schema]) memory[schema] = {};
    memory[schema][item.id] = item;
    return resolve(item);
  });
};

storage.fetchOne = function fetchOne(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('Schema name expected'));
    if (!id) return reject(new Error('ID is required'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema][id];
    if (!item) {
      return reject(new Error('item not found'));
    } 
    return resolve(item);
  });
};

storage.fetchAll = function fetchAll(schema) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    
    const allItems = Object.values(memory[schema]);
    const stores = allItems.map(store => store.id);
    
    if (!stores) {
      return reject(new Error('object not found'));
    }
    return resolve(stores);
  });
};

storage.delete = function del(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));

    const item = memory[schema][id];
    delete memory[schema][id];

    return resolve(item);
  });
};
