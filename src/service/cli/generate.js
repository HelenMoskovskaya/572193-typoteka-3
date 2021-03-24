'use strict';

const {
  shuffle,
  getRandomInt
} = require(`../../utils`);

const {
  TITLES,
  SENTENCES,
  CATEGORIES,
  createDate,
  MAX_ANNOUNCE_SENTENCES,
  DEFAULT_COUNT,
  FILE_MOCKS_NAME,
  ExitCode,
} = require(`../../constants`);

const fs = require(`fs`);


const generatePublications = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    announce: shuffle(SENTENCES).slice(0, MAX_ANNOUNCE_SENTENCES).join(``),
    fullText: shuffle(SENTENCES).slice(0, getRandomInt(1, SENTENCES.length - 1)).join(``),
    createdDate: new Date(getRandomInt(createDate.MIN_DATE_PUBLICATION, createDate.MAX_DATE_PUBLICATION)).toLocaleString(),
    сategory: shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length - 1)),
  }))
);


module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countPublications));

    if (countPublications > 1000) {
      console.info(`Не больше 1000 объявлений.`);
      process.exit(ExitCode.ERROR);
    }

    fs.writeFile(FILE_MOCKS_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file`);
      }
      return console.info(`Operation success.File created`);
    });
  }
};
