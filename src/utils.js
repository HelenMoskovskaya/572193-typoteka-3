'use strict';

const shuffle = (items) => {
  for (let i = 0; i < items.length; i++) {
    const randomPosition = Math.floor(Math.random() * (i + 1));
    [items[i], items[randomPosition]] = [items[randomPosition], items[i]];
  }
  return items;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


module.exports = {
  shuffle,
  getRandomInt,
};
