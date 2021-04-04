'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();

categoriesRouter.get(`/`, (req, res) => res.render(`categories/all-categories`));


module.exports = categoriesRouter;
