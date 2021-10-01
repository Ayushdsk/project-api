const books = [
  {
    ISBN: "123Books",
    title: "Tesla",
    pubDate: "2021-08-05",
    language: "en",
    numPage: 280,
    author: [1,2],
    publications: [1],
    category: ["tech","Space","Education"]
  }
]

const author = [
  {
    id: 1,
    name: "Aradhana",
    books: ["123Books","secretBook"]
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["123Books"]
  }
]

const publication = [
  {
    id: 1,
    name: "Writex",
    books: ["123Books"]
  },
  {
    id: 2,
    name: "hellafi",
    books: [""]
  }
]

module.exports = {books, author, publication};
