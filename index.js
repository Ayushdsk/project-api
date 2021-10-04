require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database/database"); //since database and indeex are in sae folder "./" is used here

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publications");

//Initialize express
const bookmania = express();
bookmania.use(bodyParser.urlencoded({extended: true})); //needed for post
bookmania.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
).then(() => console.log("Connection Established"));

//Books Section
//nodemon[to run type in cmd "npx nodemon <filename>"] nodemon updates the server itself whenever a change is made
/*
Route                   /
Description             Get all books
access                  PUBLIC
Parameter               none
Methods                 GET
*/
bookmania.get("/",async (req, res) => {
  const getAllBooks = await BookModel.find;
  return res.json(getAllBooks);
});

/*
Route                   /
Description             Get specific book on isbn
access                  PUBLIC
Parameter               ISBN
Methods                 GET
*/
bookmania.get("/is/:isbn",async (req, res) => {

  const getSpecificBooks = await BookModel.findOne({ISBN: req.params.isbn});
/*  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  )*/
  //null !0=1, !1=0
  if (!getSpecificBooks) {
    return res.json({
      error: `No Book found for the ISBN of ${req.params.isbn}`
    });
  }

  return res.json({
    book: getSpecificBooks
  });
});

/*
Route                   /
Description             Get specific book on category
access                  PUBLIC
Parameter               category
Methods                 GET
*/
bookmania.get("/c/:category",async (req, res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});
  /*const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )*/
  if (!getSpecificBook) {
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
bookmania.get("/author",async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
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
bookmania.get("/publications",async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
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
/*bookmania.post("/book/new", (req, res) => {                        //traditional way
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({
    updatedbooks: database.books
  });
});*/
bookmania.post("/book/new", (req, res) => {                     //by Mongoose
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was Added!!!"
  });
});


/*
Route                   /author/new
Description             add new authors
access                  PUBLIC
Parameter               none
Methods                 POST
*/
bookmania.post("/author/new",async (req,res) => {
const { newAuthor } = req.body;
const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json(
    {
      author: addNewAuthor,
      message: "Author was added!!!"
    }
  );
});


/*
Route                   /publications/new
Description             add new publisher
access                  PUBLIC
Parameter               none
Methods                 POST
*/
/*bookmania.post("/publication/new", (req,res) => {            //traditional
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});*/
bookmania.post("/publications/new",async (req,res) => {          //via mongo
const { newPublication } = req.body;
const addNewPublication = PublicationModel.create(newPublication);
  return res.json(
    {
      author: addNewPublication,
      message: "New publication was added!!!"
    }
  );
});



//PUT
/*
Route                   /publications/update/book
Description             update or add a new book for a specific publication
access                  PUBLIC
Parameter               isbn
Methods                 PUT
*/

/*bookmania.put("/publications/update/book/:isbn", (req, res) => {
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
});*/
bookmania.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
});


/*********Updating new author**********/
/*
Route            /book/author/update
Description      Update /add new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

bookmania.put("/book/author/update/:isbn", async(req,res) =>{
  //Update book database
const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN: req.params.isbn
  },
  {
    $addToSet: {
      authors: req.body.newAuthor
    }
  },
  {
    new: true
  }
);

  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      bookss: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
} );









/*
Route            /publication/update/book
Description      Update /add new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

bookmania.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});

/****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

bookmania.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
});

/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

bookmania.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList;
       return;
     }
   });


  //Update the author database
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
    message: "Author was deleted!!!!"
  });
});


//Ending
bookmania.listen(3000, () => {
  console.log("Server is up");
});
