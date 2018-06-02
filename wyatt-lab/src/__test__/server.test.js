'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = { title: 'Title goes here', content: 'Content goes here' };
let mockId = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

describe('VALID request to the API', () => {
  describe('POST /api/v1/store', () => {
    test('should respond with status 201 and created a new store', () => {
      return superagent.post(`:${testPort}/api/v1/store`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(201);
        });
    });
  });

  describe('GET /api/v1/store', () => {
    test('should respond with the a previously created store', () => {
      return superagent.get(`:${testPort}/api/v1/store?id=${mockId}`)
        .then((res) => {
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(200);
        });
    });
  });
});


describe('Invalid request to API', () => {
  describe('GET cowsay from API', () => {
    test('should err out with 404 status code for not sending anything', () => {
      return superagent.get(`:${testPort}/api/v1/cowsay`)
        .query({})
        .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
  });
  describe('GET route tests', () => {
    test('should respond with not found if id was not found', () => {
      return superagent.get(`:${testPort}/api/v1/store?id=5`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    test('should respond with bad request if there is no ID', () => {
      return superagent.get(`:${testPort}/api/v1/store?id=`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeTruthy();
        });
    });
    test('should respond with bad request if there is no body', () => {
      return superagent.get(`:${testPort}/api/v1/store?id=${mockId}`)
        .query({})
        .catch((err) => {
          expect(err.status).toEqual(400);
          expect(err).toBeTruthy();
        });
    });
  });
});
