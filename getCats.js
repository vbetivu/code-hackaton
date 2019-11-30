const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async function getCatLinks(url) {
  const response = await axios(url);
  const html = response.data;
  const $ = cheerio.load(html);
  const categoryBoxes = $(
    `.row >
    [role="main"] >
    div >
    div >
    #cat-wrapper >
    .flex-container >
    .cont >
    #main-nav >
    #collapsable-content >
    .box
    `
  );

  const catLink = [];

  for (let i = 0; i < categoryBoxes.length; i++) {
    const tag = $(categoryBoxes[i]).find("a.btn")[0];
    if (tag) {
      const href = $(tag)
        .attr("href")
        .split("/");
      const type = $(tag).text();
      href.splice(8, 0, "1_50", "relevance-desc");
      catLink.push({ href: href.join("/"), type });
    }
  }

  return catLink;
};
