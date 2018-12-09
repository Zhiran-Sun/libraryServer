let mongoose = require('mongoose');

import Book from '../models/books';
import express from 'express';

let router = express.Router();

var mongodbUri = 'mongodb://admin:123456a@ds139883.mlab.com:39883/librarydb';

mongoose.connect(mongodbUri);
let db = mongoose.connection;
db.on('error',function(err){
    console.log('Unable to Connect to [ ' + db.name + ']',err);
});
db.once('open',function(){
    console.log('Successfully Connected to [ '+db.name+']');
});

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Book.find(function(err,book){
        if(err)
            res.send(err);
        // res.send(JSON.stringify(book,null,5));
        res.send(book);
    });
}

router.findOne=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Book.find({"_id":req.params.id},function(err, book) {
        if(err)
            res.json({message:'Book NOT Found!',errmsg:err});
        else
            res.send(book);
    });
}


//findByName(),findByPress are the functions which support fuzzy search.
router.findByName=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Book.find({"book_name":{$regex:req.params.name}},function(err, book) {
        if(err)
            res.json({message:'Book NOT Found!'});
        else
            res.send(book);
    });
}

router.findByPress=(req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    Book.find({"publishing":{$regex:req.params.press}},function(err, book) {
        if(err)
            res.json({message:'Book NOT Found!'});
        else
            res.send(book);
    });
}

function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
}

router.addBook = (req, res) => {
    res.setHeader('Content-Type','application/json');
    var book = new Book();
    book.book_name = req.body.book_name;
    book.author = req.body.author;
    book.publishing = req.body.publishing;
    book.save(function (err) {
        if(err)
            res.json({message:'Book NOT Added!'});
        else
            res.json({message:'Book Successfully Added!', data: book});
    });
}

router.incrementUpvotes = (req, res) => {

    Book.findById(req.params.id, function(err,book) {
        if (err)
            res.json({ message: 'Book NOT Found!', errmsg : err } );
        else {
            book.upvotes += 1;
            book.save(function (err) {
                if (err)
                    res.json({ message: 'Book NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Book Successfully Upvoted!', data: book });
            });
        }
    });
}

router.editBook = (req, res) => {
    res.setHeader('Content-Type','application/json');
    Book.findById(req.params.id, function(err,book) {
        if (err)
            res.json({ message: 'Book NOT Found!', errmsg : err } );
        else {
            book.book_name = req.body.book_name;
            book.author = req.body.author;
            book.publishing = req.body.publishing;
            book.save(function (err) {
                if (err)
                    res.json({ message: 'Book NOT Edit!', errmsg : err } );
                else
                    res.json({ message: 'Book Successfully Edited!', data: book });
            });
        }
    });
}

router.deleteBook = (req, res) => {
    Book.findByIdAndRemove(req.params.id, function (err) {
        if(err)
            res.json({message:'Book NOT Deleted!'});
        else
            res.json({message:'Book Successfully Deleted!'});
    });
}

router.findTotalVotes = (req, res) => {

    Book.find(function(err, book) {
        if (err)
            res.send(err);
        else
            res.json({ totalvotes : getTotalVotes(book) });
    });
}

function countBorrowed(array) {
    let totalNumber = 0;
    array.forEach(function (obj) {
        if(!obj.status)
            totalNumber++;
    });
    return totalNumber;
}

function countInLibrary(array) {
    let totalNumber = 0;
    array.forEach(function (obj) {
        if(obj.status)
            totalNumber++;
    });
    return totalNumber;
}

//getBorrowedNumber() function is to count the number of books which has been borrowed.
router.getBorrowedNumber = (req,res) => {
    Book.find(function(err,book){
        if(err)
            res.send(err);
        else
            res.json({totalBorrowedNumber:countBorrowed(book)});
    });
}


//getInLibraryNumber() function is to count the number of books which are in library now.
router.getInLibraryNumber = (req,res) => {
    Book.find(function(err,book){
        if(err)
            res.send(err);
        else
            res.json({totalInLibraryNumber:countInLibrary(book)});
    });
}

//findAllBorrowed() function is to get all the books which are borrowed.
router.findAllBorrowed = (req,res) => {
    Book.find({'status':false},function (err,book) {
        if(err)
            res.send(err);
        else
            res.send(book);
    });
}

//findAllInLibrary() function is to get all the books which are in library.
router.findAllInLibrary = (req,res) => {
    Book.find({'status':true},function (err,book) {
        if(err)
            res.send(err);
        else
            res.send(book);
    });
}

module.exports = router;
