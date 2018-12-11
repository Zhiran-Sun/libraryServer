let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let Book = require('../../models/books');

chai.use(chaiHttp);
let _ = require('lodash' );
chai.use(require('chai-things'));
describe('Library',  () => {
    beforeEach(function(){
        var book1 = new Book();
        book1.book_name = "Time Book";
        book1.author = "One Interesting Person";
        book1.publishing = "Time Press";
        var book2 = new Book();
        book2.book_name = "Space Book";
        book2.author = "One Sleeping Person";
        book2.publishing = "Space Press";
        var book3 = new Book();
        book3.book_name = "World Book";
        book3.author = "One Walking Person";
        book3.publishing = "World Press";
        book1.save();
        book2.save();
        book3.save();
    });

    describe('GET /books',  () => {
        it('should return all the books of library', function(done) {
            chai.request(server)
                .get('/books')
                .end((err, res) => {
                    expect(res.body).to.be.a('array');
                    // expect(res.body.length).to.equal(3);
                    expect(res.body[0].book_name).to.equal("Time Book");
                    expect(res.body[0].author).to.equal("One Interesting Person");
                    expect(res.body[0].publishing).to.equal("Time Press");
                    done();
                });
        });
        after(function(done){
            Book.collection.deleteMany();
            done();
        });
    });

    describe('GET /books/:name/byName',  () => {
        it('should return the books with right name', function(done) {
            chai.request(server)
                .get('/books/Time Boo/byName')
                .end((err, res) => {
                    expect(res.body).to.be.a('array');
                    done();
                });
        });
        after(function(done){
            Book.collection.deleteMany();
            done();
        });
    });

    describe('GET /books/:press/byPress',  () => {
        it('should return the books with right press', function(done) {
            chai.request(server)
                .get('/books/Time Press/byPress')
                .end((err, res) => {
                    expect(res.body).to.be.a('array');
                    done();
                });
        });
        after(function(done){
            Book.collection.deleteMany();
            done();
        });
    });

    describe('GET /books/:id',  function()  {
        it('should return the books with correct id', function(done) {
            Book.find({"book_name":"Time Book"},'_id', function (err, book) {
                if(book){
                    // var id = book[0];
                    chai.request(server)
                        .get('/books/Time Press/byPress')
                        .end((err, res) => {
                            expect(res.body).to.be.a('array');
                            expect(res.body[0].book_name).to.equal("Time Book");
                            expect(res.body[0].author).to.equal("One Interesting Person");
                            expect(res.body[0].publishing).to.equal("Time Press");
                            done();
                        });
                }
            });
        });
        after(function(done){
            Book.collection.deleteMany();
            done();
        });
    });

    describe('POST /books', function () {
        it('should return successful message and the new book', function(done) {
            let newbook = {"book_name":"Happy book", "author":"HelloHello", "publishing":"Good Language Press"};
            chai.request(server)
                .post('/books')
                .send(newbook)
                .end(function(err, res) {
                    expect(res.body).to.have.property('message').equal('Book Successfully Added!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books')
                .end(function(err, res) {
                    let len = res.body.length-1;
                    expect(res.body).to.be.a('array');
                    Book.collection.deleteMany();
                    done();
                });
        });
    });

    describe('DELETE /books/:id', function () {
        it('should return a message that deleting successfully and the deleted book', function(done){
            Book.find({"book_name":"Time Book"},'_id', function (err, book) {
                if(book){
                    var id = book[0]._id;
                    chai.request(server)
                        .delete('/books/'+id)
                        .end(function(err,res){
                            expect(res.body).to.have.property('message','Book Successfully Deleted!' ) ;
                            done();
                        });
                }
            });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books')
                .end(function(err, res) {
                    Book.collection.deleteMany();
                    done();
                });
        });
    });

    describe('PUT /books/:id/vote', function () {
        it('should return a message that voting successfully', function(done){
            Book.find({"book_name":"Time Book"},'_id', function (err, book) {
                if(book){
                    var id = book[0]._id;
                    chai.request(server)
                        .put('/books/'+id+'/vote')
                        .end(function(err,res){
                            expect(res.body).to.have.property('message','Book Successfully Upvoted!' ) ;
                            done();
                        });
                }
            });
        });
        after(function  (done) {
            chai.request(server)
                .get('/books')
                .end(function(err, res) {
                    Book.collection.deleteMany();
                    done();
                });
        });
    });

});
