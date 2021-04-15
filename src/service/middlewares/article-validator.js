'use strict';

const {HttpCode} = require(`../../constants`);


const articleKeys = [
  `title`,
  `createdDate`,
  `category`,
  `announce`,
  `fullText`,
  `comments`];


module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keyExists = articleKeys.every((key) => keys.includes(key));

  if (!keyExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  return next();
};
