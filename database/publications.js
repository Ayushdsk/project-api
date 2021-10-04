const mongoose = require("mongoose");

//create Publication schema__
const PublicationSchema = mongoose.Schema(
  {
    id: Number,
    name: String,
    books: [String],
    date: String
  }
);


const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
