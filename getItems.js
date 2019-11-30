const axios = require("axios");
const cheerio = require("cheerio");
const moveToDb = require("./db");

module.exports = async function getItems({ href: url, type }) {
  const response = await axios(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const articles = $(
    `
    .row >
    [role="main"] >
    form > 
    [data-component="list-page-product-list"] >
    .resultList >
    article.product
    `
  );

  const products = [];
  if (articles.length) {
    for (let i = 0; i < articles.length; i++) {
      const tag = $(articles[i]).find('span[data-product="name"]')[0];
      if (tag && i !== 1) {
        const name = $(tag).text();
        const adKeyword = name.split(" ").pop();

        if (adKeyword !== "years" && adKeyword !== "year") {
          const brand = $(articles[i])
            .find('span[data-product="brand"]')
            .text();
          const productDescription = $(articles[i])
            .find("ul.productDescription")
            .text()
            .trim();
          const productDescText = $(articles[i])
            .find("span.product-desc-text")
            .text();
          const price = $(articles[i])
            .find('strong[data-product="price"]')
            .text()
            .trim();
          const score = $(articles[i])
            .find("span.dc-rating-count")
            .text()
            .trim();

          products.push({
            name,
            brand,
            productDescription,
            productDescText,
            price,
            type,
            score
          });
        }
      }
    }

    moveToDb(products);

    const nextUrl = url.split("/");
    const currentPage = nextUrl[8].split("_");
    nextUrl.splice(8, 1, `${parseInt(currentPage[0]) + 1}_50`);

    getItems({ href: nextUrl.join("/"), type });
  }
};
