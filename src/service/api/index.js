'use strict';

const {Router} = require(`express`);

const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const getMockData = require(`../lib/get-mock-data`);
const {
  CategoryService,
  CommentService,
  SearchService,
  ArticleService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const articles = await getMockData();

  category(app, new CategoryService(articles));
  article(app, new ArticleService(articles), new CommentService());
  search(app, new SearchService(articles));
})();

module.exports = app;
