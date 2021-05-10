'use strict';

const {HttpCode} = require(`../../constants`);


const articleKeys = [
  `title`,
  `announce`,
  `fullText`,
  `createdDate`,
  `сategory`
];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keyExists = articleKeys.every((key) => keys.includes(key));

  if (!keyExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  } else {
    next();
  }
};
