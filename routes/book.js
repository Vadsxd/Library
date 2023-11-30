const express = require('express');
const {auth} = require("../middleware/auth");
const fs = require("fs");

const booksData = './data/books.json';
const usersFile = './data/users.json';

const router = express.Router();

router.get('/:id', auth, (req, res) => {
    const book = JSON.parse(fs.readFileSync(booksData)).filter(
        (book) => book.id === +req.params.id
    );
    let bookUserName = JSON.parse(fs.readFileSync(usersFile)).find((u) => u.id === +book[0].takenBy);
    if (bookUserName) {
        bookUserName = bookUserName.name;
    }
    res.render('book', {book, bookUserName, user: { name: req.username, id: req.id }});
});

module.exports = router;