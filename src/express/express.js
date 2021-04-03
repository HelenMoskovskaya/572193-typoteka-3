'use strict';

const express = require(`express`);

const {
  DEFAULT_EXPRESS_PORT,
} = require(`../constants`);

const mainRouter = require(`./routes/main-routes`);
const myRouter = require(`./routes/my-routes`);
const articlesRouter = require(`./routes/articles-routes`);
const categoriesRouter = require(`./routes/categories-routes`);


const app = express();

app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);
app.use(`/categories`, categoriesRouter);

app.listen(DEFAULT_EXPRESS_PORT);

