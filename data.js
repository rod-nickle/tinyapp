const bcrypt = require("bcryptjs");

 /**
 * This is our database. 🙂
 */
const urlDatabase = {
  "1DbaZv": {
    longURL: "https://www.tsn.ca",
    userId: "lSHoYY",
  },
  VkXQck: {
    longURL: "https://www.google.ca",
    userId: "lSHoYY",
  },
  eMe7jn: {
    longURL: "https://www.lighthouselabs.ca",
    userId: "Hh65Sm",
  },
};

const users = {
  lSHoYY: {
    id: "lSHoYY",
    email: "a@a.com",
    password: bcrypt.hashSync("1234", 10),
  },
  Hh65Sm: {
    id: "Hh65Sm",
    email: "b@b.com",
    password: bcrypt.hashSync("1234", 10),
  },
};

module.exports = {urlDatabase, users};