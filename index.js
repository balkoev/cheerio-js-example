const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const parse = async () => {
  const getHTML = async (url) => {
    const { data } = await axios.get(url);
    return cheerio.load(data);
  };

  const $ = await getHTML(`https://kanobu.ru/games/ps-4/popular/?page=1`);
  const pagesNumber = $('a.ui-kit-paginator--list-link').eq(-2).text();

  for (let i = 1; i < pagesNumber; i++) {
    const selector = await getHTML(
      `https://kanobu.ru/games/ps-4/popular/?page=${i}`
    );
    selector('.c-game').each((i, element) => {
      const title = selector(element).find('div.h2').text();
      const link = `https://kanobu.ru${selector(element)
        .find('a')
        .attr('href')}`;

      fs.appendFileSync('./file.txt', `${title};${link}\n`);
    });
  }
};

parse();
