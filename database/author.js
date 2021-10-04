const mongoose = require("mongoose");

//create Author schema__
const AuthorSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);


const AuthorModel = mongoose.model("author", AuthorSchema);

module.exports = AuthorModel;
