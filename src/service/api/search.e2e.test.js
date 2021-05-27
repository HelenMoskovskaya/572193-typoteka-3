'use strict';

const express = require(`express`);
const request = require(`supertest`);
const fs = require(`fs`);
const path = require(`path`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const getMockData = (mockName) => {
  const mockFile = path.join(__dirname, `../../fixtures/${mockName}.json`);
  const mockData = JSON.parse(fs.readFileSync(mockFile, `UTF8`));
  return mockData;
};

const createAPI = () => {
  const mockData = getMockData(`search.test`);
  const app = express();
  app.use(express.json());
  search(app, new DataService(mockData));
  return app;
};


describe(`API returns article based on search query`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/search`)
    .query({
      query: `Как достигнуть успеха не вставая с кресла`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`Uoe6NR`));
});

test(`Api returns code 404 if nothing is found`,
    () => {
      const app = createAPI();
      return request(app)
    .get(`/search`)
    .query({
      query: `Куплю машину`
    })
    .expect(HttpCode.NOT_FOUND);
    });

test(`API returns 400 when query string is absent`,
    () => {
      const app = createAPI();
      return request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
    });
