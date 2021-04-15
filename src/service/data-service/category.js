'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = new Set(this._articles.map((item) => {
      return item.сategory;
    }).flat());

    return [...categories];
  }
}


module.exports = CategoryService;
