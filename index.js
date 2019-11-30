const getCatLinks = require("./getCats");
const getItems = require("./getItems");

async function getData(url) {
  const catLinks = await getCatLinks(url);
  catLinks.forEach(link => {
    getItems(link);
  });
}

getData(
  "https://www.currys.co.uk/gbuk/computing-accessories/data-storage-355-c.html"
);
