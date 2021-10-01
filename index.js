const express = require("express");
var bodyParser = require("body-parser");
//Database
const database = require("./database"); //since database and indeex are in sae folder "./" is used here

//Initialize express
const bookmania = express();
bookmania.use(bodyParser.urlencoded({
  extended: true
})); //needed for post
bookmania.use(bodyParser.json());

//Books Section
//nodemon[to run type in cmd "npx nodemon <filename>"] nodemon updates the server itself whenever a change is made
/*
Route                   /
Description             Get all books
access                  PUBLIC
Parameter               none
Methods                 GET
*/
bookmania.get("/", (req, res) => {
  return res.json({
    books: database.books
  });
})

/*
Route                   /
Description             Get specific book on isbn
access                  PUBLIC
Parameter               ISBN
Methods                 GET
*/
bookmania.get("/is/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  )
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No Book found for the ISBN of ${req.params.isbn}`
    });
  }

  return res.json({
    book: getSpecificBook
  });
});

/*
Route                   /
Description             Get specific book on category
access                  PUBLIC
Parameter               category
Methods                 GET
*/
bookmania.get("/c/:category", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No Book found for the category of ${req.params.category}`
    });
  }
  return res.json({
    book: getSpecificBook
  });
});

/*
Route                   /
Description             Get specific book on language
access                  PUBLIC
Parameter               Language
Methods                 GET
*/
bookmania.get("/l/:language", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  )
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found of the language ${req.params.language}`
    });
  }
  return res.json({
    book: getSpecificBook
  });
});



//Authors Section
/*
Route                 /author
Description             Get all authors
access                  PUBLIC
Parameter               none
Methods                 GET
*/
bookmania.get("/author", (req, res) => {
  return res.json({
    Authors: database.author
  });
})


/*
Route                 /author/book
Description             Get all authors
access                  PUBLIC
Parameter               isbn
Methods                 GET
*/
bookmania.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({
    authors: getSpecificAuthor
  });
})


/*
Route                 /author/book
Description             Get all authors
access                  PUBLIC
Parameter               id
Methods                 GET
*/
bookmania.get("/author/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );
  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found with is ${req.params.id}`
    });
  }
  return res.json({
    authors: getSpecificAuthor
  });
})


//PUBLICATIONS
/*
Route                 /publications
Description             Get all PUBLICATION
access                  PUBLIC
Parameter               none
Methods                 GET
*/
bookmania.get("/publications", (req, res) => {
  return res.json({
    publication: database.publication
  });
})

/*
Route                   /publications
Description             Get specific PUBLICATION
access                  PUBLIC
Parameter               publication name
Methods                 GET
*/
bookmania.get("/publications/:name", (req, res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.name === req.params.name
  )
  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `No book found of ${req.params.name} publication`
    });
  }
  return res.json({
    publication: getSpecificPublication
  });
})


/*
Route                   /publications
Description             Get specific PUBLICATION
access                  PUBLIC
Parameter               publication name
Methods                 GET
*/
bookmania.get("/publication/:isbn", (req, res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  )
  if (getSpecificPublication.length === 0) {
    return res.json({
      error: `no publications have printed ${req.params.isbn}`
    });
  }
  return res.json({
    publication: getSpecificPublication
  });
})





//POST
/*
Route                   /books/new
Description             add new books book
access                  PUBLIC
Parameter               none
Methods                 POST
*/
bookmania.post("/book/new", (req, res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({
    updatedbooks: database.books
  });
});


/*
Route                   /author/new
Description             add new authors
access                  PUBLIC
Parameter               none
Methods                 POST
*/
bookmania.post("/author/new", (req, res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});


/*
Route                   /publications/new
Description             add new publisher
access                  PUBLIC
Parameter               none
Methods                 POST
*/
bookmania.post("/publications/new", (req, res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});




//PUT
/*
Route                   /publications/update/book
Description             update or add a new book for a specific publication
access                  PUBLIC
Parameter               isbn
Methods                 PUT
*/

bookmania.put("/publications/update/book/:isbn", (req, res) => {
  //update the publication database
  database.publication.forEach((pub) => {
    if (pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });
  //update the book Database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publication: database.publication,
      message: "successfully updated publication"
    }
  );
});


//**********Delete*********
/*
Route                   /book/delete
Description             delete a book
access                  PUBLIC
Parameter               isbn
Methods                 PUT
*/
bookmania.delete("/book/delete/:isbn", ( req,res) =>{
  //Whivhever book that doeds not match with the isbn just send it to an updated database array and rest will be filtered out
  const updatedBookDatabase = database.books.filter(
    (book) =>book.ISBN === req.params.isbn
  )
  database.books = updatedBookDatabase;
  return res.json({books: database.books});
});


/*
Route                   /book/delete/author
Description             delete a n author from book and vice-versa
access                  PUBLIC
Parameter               isbn,authorId
Methods                 PUT
*/
bookmania.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //update the book Database
  database.books.forEach((book) => {
    if(book.ISBN  === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });
  //update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author was Yeeted!!!"
  });
});




//Ending
bookmania.listen(3000, () => {
  console.log("Server is up");
});
