'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);


class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  create(article) {
    const newArticle = Object.assign(
        {id: nanoid(MAX_ID_LENGTH), comments: []}, article);

    this._articles.push(newArticle);

    return newArticle;
  }

  update(id, article) {
    const oldArticle = this._articles.find((item) => item.id === id);

    return Object.assign(oldArticle, article);
  }

  remove(id) {
    const dropArticle = this._articles.find((item) => item.id === id);

    if (!dropArticle) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return dropArticle;
  }
}


module.exports = ArticleService;
