'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `LtNkMR`,
    "comments": [
      {
        "id": `9Bn2sb`,
        "text": `А сколько игр в комплекте?Вы что?! В магазине дешевле.`
      },
      {
        "id": `e8BW-n`,
        "text": `Неплохо, но дорого.Оплата наличными или перевод на карту?Почему в таком ужасном состоянии?Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `elMrIn`,
        "text": `С чем связана продажа? Почему так дешёво?А где блок питания?`
      }
    ],
    "title": `Как начать программировать`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.Это один из лучших рок-музыкантов.Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.Собрать камни бесконечности легко если вы прирожденный герой.Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Помните небольшое количество ежедневных упражнений лучше чем один раз но много.Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?Собрать камни бесконечности легко если вы прирожденный герой.Это один из лучших рок-музыкантов.Первая большая ёлка была установлена только в 1938 году.Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.Из под его пера вышло 8 платиновых альбомов.Как начать действовать? Для начала просто соберитесь.Простые ежедневные упражнения помогут достичь успеха.Он написал больше 30 хитов.`,
    "createdDate": `09.02.2021, 22:24:04`,
    "сategory": [`Разное`, `Без рамки`, `Кино`, `Программирование`]
  },
  {
    "id": `0q5s1x`,
    "comments": [
      {
        "id": `4Tz5E2`,
        "text": `Совсем немного...А где блок питания?А сколько игр в комплекте?`
      }
    ],
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.Простые ежедневные упражнения помогут достичь успеха.Это один из лучших рок-музыкантов.Собрать камни бесконечности легко если вы прирожденный герой.Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.Он написал больше 30 хитов.Достичь успеха помогут ежедневные повторения.Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.Простые ежедневные упражнения помогут достичь успеха.Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.Игры и программирование разные вещи. Не стоит идти в программисты если вам нравятся только игры.Собрать камни бесконечности легко если вы прирожденный герой.Это один из лучших рок-музыкантов.Помните небольшое количество ежедневных упражнений лучше чем один раз но много.Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "createdDate": `10.03.2021, 20:11:20`,
    "сategory": [`Деревья`, `Программирование`, `Разное`, `Кино`, `Музыка`, `Без рамки`]
  }
];


const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};


describe(`API  returns a list of all articles`, () => {

  const app = createAPI();
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

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/LtNkMR`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как начать программировать"`,
      () => expect(response.body.title).toBe(`Как начать программировать`));

});

describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    title: `Как бороться с бессонницей`,
    announce: `Самые действенные методы борьбы с бессонницей`,
    fullText: `Самые действенные методы борьбы с бессонницей. Работают для всех. Быстрый результат. Здоровый сон обеспечен.`,
    createdDate: `2020-05-09 13:08:12`,
    сategory: [`Здоровье`],
  };

  const app = createAPI();
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

describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    title: `Как бороться с бессонницей`,
    announce: `Самые действенные методы борьбы с бессонницей`,
    fullText: `Самые действенные методы борьбы с бессонницей. Работают для всех. Быстрый результат. Здоровый сон обеспечен.`,
    createdDate: `2020-05-09 13:08:12`,
    сategory: [`Здоровье`],
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle);
      expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {

  const newArticle = {
    title: `Как бороться с бессонницей`,
    announce: `Самые действенные методы борьбы с бессонницей`,
    fullText: `Самые действенные методы борьбы с бессонницей. Работают для всех. Быстрый результат. Здоровый сон обеспечен.`,
    createdDate: `2020-05-09 13:08:12`,
    сategory: [`Здоровье`],
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .put(`/articles/0q5s1x`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/0q5s1x`)
      .expect((res) => expect(res.body.title).toBe(`Как бороться с бессонницей`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();
  const validArticle = {
    title: `Это`,
    announce: `валидный`,
    fullText: `объект`,
    createdDate: `однако`,
    сategory: [`404`],
  };

  return request(app)
    .put(`/articles/0q5s9x`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidArticle = {
    title: `Это`,
    announce: `невалидный`,
    fullText: `объект`,
    сategory: [`400`],
  };

  return request(app)
    .put(`/articles/0q5s9x`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/0q5s1x`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`0q5s1x`));
  test(`Article count is 1 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/0q5s9x`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to article`, () => {

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/LtNkMR/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id equals "9Bn2sb"`, () => expect(response.body[0].id).toBe(`9Bn2sb`));
});

describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `А я не сплю уже месяц`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/LtNkMR/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comment count is changed`, () => request(app)
    .get(`/articles/LtNkMR/comments`)
    .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to create a comment if data is invalid`, () => {

  const newComment = {
    part: `Я сплю 10 часов`
  };

  const app = createAPI();

  return request(app)
    .post(`/articles/LtNkMR/comments`)
    .send(newComment)
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent article and returns code 404`, () => {

  const newComment = {
    text: `Такой статьи нет`
  };

  const app = createAPI();

  return request(app)
    .post(`/articles/OLkij/comments`)
    .send(newComment)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/LtNkMR/comments/iklopl`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/LtNkMR/comments/9Bn2sb`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`9Bn2sb`));
  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/LtNkMR/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});
