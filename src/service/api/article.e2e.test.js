'use strict';

const express = require(`express`);
const request = require(`supertest`);
const fs = require(`fs`);
const path = require(`path`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const getMockData = (mockName) => {
  const mockFile = path.join(__dirname, `../../fixtures/${mockName}.json`);
  const mockData = JSON.parse(fs.readFileSync(mockFile, `UTF8`));
  return mockData;
};

const createAPI = (data) => {
  const app = express();
  app.use(express.json());
  article(app, new DataService(data), new CommentService());
  return app;
};


describe(`API  returns a list of all articles`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`returns a list of 2 articles`, () => expect(response.body.length).toBe(2));
  test(`First article's id equals "LtNkMR"`, () => expect(response.body[0].id).toBe(`LtNkMR`));
});


describe(`API returns an article with given id`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${mockData[0].id}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как начать программировать"`,
      () => expect(response.body.title).toBe(`Как начать программировать`));
});


describe(`API creates an article if data is valid`, () => {
  const mockData = getMockData(`article.test`);
  const newArticle = getMockData(`newArticle.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(3)));
});


test(`API refuses to create an article if data is invalid`, async () => {
  const mockData = getMockData(`article.test`);
  const newArticle = getMockData(`newArticle.test`);
  const app = createAPI(mockData);

  for (const key of Object.keys(newArticle)) {
    const badArticle = {...newArticle};
    delete badArticle[key];
    await request(app)
      .post(`/articles`)
      .send(badArticle)

      .expect(HttpCode.BAD_REQUEST);
  }
});


describe(`API changes existent article`, () => {
  const mockData = getMockData(`article.test`);
  const newArticle = getMockData(`newArticle.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
    .put(`/articles/${mockData[1].id}`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/${mockData[1].id}`)
      .expect((res) => expect(res.body.title).toBe(`Как бороться с бессонницей`))
  );
});


test(`API returns status code 404 when trying to change non-existent article`, () => {
  const mockData = getMockData(`article.test`);
  const validArticle = getMockData(`newArticle.test`);
  const app = createAPI(mockData);

  return request(app)
    .put(`/articles/0q5s9x`)
    .send(validArticle)

    .expect(HttpCode.NOT_FOUND);
});


test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const mockData = getMockData(`article.test`);
  const invalidArticle = getMockData(`invalidArticle.test`);
  const app = createAPI(mockData);

  return request(app)
    .put(`/articles/0q5s9x`)
    .send(invalidArticle)

    .expect(HttpCode.BAD_REQUEST);
});


describe(`API correctly deletes an article`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${mockData[1].id}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`${mockData[1].id}`));
  test(`Article count is 2 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(2))
  );
});


test(`API refuses to delete non-existent article`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);

  return request(app)
    .delete(`/articles/0q5s9x`)

    .expect(HttpCode.NOT_FOUND);
});


describe(`API returns a list of comments to article`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${mockData[0].id}/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id equals "${mockData[0].comments[0].id}"`, () => expect(response.body[0].id).toBe(`${mockData[0].comments[0].id}`));
});


describe(`API creates a comment if data is valid`, () => {
  const mockData = getMockData(`article.test`);
  const newComment = getMockData(`newComment.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/${mockData[0].id}/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comment count is changed`, () => request(app)
    .get(`/articles/${mockData[0].id}/comments`)
    .expect((res) => expect(res.body.length).toBe(4)));
});


test(`API refuses to create a comment if data is invalid`, () => {
  const mockData = getMockData(`article.test`);
  const newComment = getMockData(`invalidComment.test`);
  const app = createAPI(mockData);

  return request(app)
    .post(`/articles/${mockData[0].id}/comments`)
    .send(newComment)

    .expect(HttpCode.BAD_REQUEST);
});


test(`API refuses to create a comment to non-existent article and returns code 404`, () => {
  const mockData = getMockData(`article.test`);
  const newComment = getMockData(`newComment.test`);
  const app = createAPI(mockData);

  return request(app)
    .post(`/articles/OLkij/comments`)
    .send(newComment)
    .expect(HttpCode.NOT_FOUND);
});


test(`API refuses to delete non-existent comment`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);

  return request(app)
    .delete(`/articles/${mockData[0].id}/comments/iklopl`)

    .expect(HttpCode.NOT_FOUND);
});


describe(`API correctly deletes a comment`, () => {
  const mockData = getMockData(`article.test`);
  const app = createAPI(mockData);
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${mockData[0].id}/comments/${mockData[0].comments[1].id}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`${mockData[0].comments[1].id}`));
  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/${mockData[0].id}/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});
