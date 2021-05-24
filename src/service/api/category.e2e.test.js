'use strict';

const express = require(`express`);
const request = require(`supertest`);
const fs = require(`fs`);
const path = require(`path`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const getMockData = (mockName) => {
  const mockFile = path.join(__dirname, `../../fixtures/${mockName}.json`);
  const mockData = JSON.parse(fs.readFileSync(mockFile, `UTF8`));
  return mockData;
};


describe(`API returns category list`, () => {
  const mockData = getMockData(`category.test`);
  const app = express();
  app.use(express.json());
  category(app, new DataService(mockData));

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`StatusCode 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are "Кино", "IT", "Без рамки", "За жизнь"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Кино`, `IT`, `Без рамки`, `За жизнь`])
      ));
});
