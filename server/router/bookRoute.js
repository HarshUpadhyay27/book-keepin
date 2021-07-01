const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const authMiddleware = require("../middleware/authMiddleware");
const Book = require("../models/book");

const bookRouter = express.Router();

//creating a new book
bookRouter.post(
  "/api/book/",
  authMiddleware,
  expressAsyncHandler(async (req, res) => {
  
    const userId = req.user._id

    const book = await Book.create({
      title:req.body.title,
      category:req.body.category,
      createdBy:userId,
      author:req.body.author
    });
    if (book) {
      res.status(200);
      res.json(book);
    } else {
      res.status(500);
      throw new Error("Book creating failed");
    }
  })
);

bookRouter.get(
  "/api/book/",
  expressAsyncHandler(async (req, res) => {
    const book = await Book.find({}).populate('createdBy').sort('createdAt');
    if (book) {
      res.status(200);
      res.json(book);
    } else {
      res.status(500);
      throw new Error("There are no book");
    }
  })
);

bookRouter.put(
  "/api/book/:id",
  expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
      const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true
      });
      res.status(200)
      res.json(updateBook)
    }else{
        res.send(500)
        throw new Error('Update Failed')
    }
  })
);

bookRouter.delete("/api/book/:id", expressAsyncHandler(async (req, res)=>{
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    res.status(200)
    res.send(book)
  } catch (error) {
    res.json(error)
  }
}))

module.exports = bookRouter;
