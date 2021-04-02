'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);


const {
  shuffle,
  getRandomInt
} = require(`../../utils`);

const {
  MAX_ANNOUNCE_COUNT,
  DEFAULT_COUNT,
  FILE_MOCKS_NAME,
  ExitCode,
  MAX_PUBLICATION_COUNT,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
} = require(`../../constants`);


const currentDate = new Date();

const createDatePublication = {
  minDate: currentDate.getTime(),
  maxDate: new Date(currentDate.setMonth(currentDate.getMonth() - 3))
};

const generatePublications = (count, titles, categories, sentences) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, MAX_ANNOUNCE_COUNT).join(``),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(``),
    createdDate: new Date(getRandomInt(createDatePublication.minDate, createDatePublication.maxDate)).toLocaleString(),
    сategory: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).slice(0, -1);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};


module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generatePublications(countPublications, titles, categories, sentences));

    if (countPublications > MAX_PUBLICATION_COUNT) {
      console.info(chalk.red(`Не больше 1000 объявлений.`));
      process.exit(ExitCode.ERROR);
    }

    try {
      await fs.writeFile(FILE_MOCKS_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

