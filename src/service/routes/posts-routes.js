'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;

const {
  FILE_MOCKS_NAME,
} = require(`../../constants`);

const postsRoutes = new Router();

postsRoutes.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_MOCKS_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});

module.exports = postsRoutes;
