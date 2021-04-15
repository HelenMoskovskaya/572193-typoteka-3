'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);
const articleExist = require(`../middlewares/article-exists`);


const route = new Router();


module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, (req, res) =>{
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(article);

  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    const updateArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updateArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deleteArticle = articleService.remove(articleId);

    if (!deleteArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found article with ${articleId} id`);
    }

    return res.status(HttpCode.OK).json(deleteArticle);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deleteComment = commentService.remove(article, commentId);

    if (!deleteComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found comment with ${commentId} id`);
    }

    return res.status(HttpCode.OK).json(deleteComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleValidator), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
