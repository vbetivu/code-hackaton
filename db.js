const pgp = require("pg-promise")({});

const cn = {
  host: "localhost",
  port: 5432,
  database: "webscrap",
  user: "postgres",
  password: "postgres"
};

const db = pgp(cn);

module.exports = async function insertInDb(prod) {
  prod.forEach(async elem => {
    db.any(
      `INSERT into products (brand, type, name, price, score, description_list, description_text) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        elem.brand,
        elem.type,
        elem.name,
        elem.price,
        elem.score,
        elem.productDescription,
        elem.productDescText
      ]
    );
  });
};
