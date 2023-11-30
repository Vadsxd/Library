const express = require('express');
const fs = require("fs");
const {auth} = require("../middleware/auth");

const usersFile = './data/users.json';
const booksData = './data/books.json';

const router = express.Router();

router.get('/', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData));
    res.render('library', {books, user: { name: req.username, id: req.id }});
});

router.post('/add', auth, (req, res) => {
    let {author, title, releaseDate} = req.body;
    const books = JSON.parse(fs.readFileSync(booksData));

    const id = books[Object.keys(books).pop()].id + 1;
    const newBook = {
        id,
        title,
        author,
        availability: "Yes",
        releaseDate,
        returnDate: null,
        takenBy: null
    }

    books.push(newBook);
    fs.writeFileSync(booksData, JSON.stringify(books, null, 2));
    res.redirect('/library');
});

router.get('/sortByAvailability', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).sort((a, b) => {
        if (a.availability < b.availability) return 1;
        if (a.availability > b.availability) return -1;
        return 0;
    });
    res.json({books});
});

router.get('/sortByReturnDate', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).sort((a, b) => {
        return new Date(b.returnDate) - new Date(a.returnDate);
    });
    res.json({books});
});

router.get('/sortByReleaseDate', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).sort((a, b) => {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
    });
    res.json({books});
});

router.get('/sortByAuthor', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).sort((a, b) => {
        return a.author.localeCompare(b.author);
    });
    res.json({books});
});

router.get('/sortByTitle', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).sort((a, b) => {
        return a.title.localeCompare(b.title);
    });
    res.json({books});
});

router.delete('/:id', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).filter(
        (book) => book.id !== +req.params.id
    );
    fs.writeFileSync(booksData, JSON.stringify(books, null, 2));
    res.end();
});

router.post('/user/:id', auth, (req, res) => {
    const user = JSON.parse(fs.readFileSync(usersFile)).find((u) => u.id === +req.params.id).name;
    const books = JSON.parse(fs.readFileSync(booksData)).filter(
        (book) => book.takenBy === +req.params.id
    );
    res.json({ user, books });
});

router.post('/takeBook/:id', auth, (req, res) => {
    const today = new Date();
    const returnDate = new Date(today.setDate(today.getDate() + 7)).toISOString().slice(0, 10);

    const books = JSON.parse(fs.readFileSync(booksData)).map((book) => {
        if (book.id === +req.params.id) {
            if (book.availability === "Yes") {
                (book.returnDate = returnDate), (book.availability = "No"), (book.takenBy = req.id);
            }
        }
        return book;
    });
    fs.writeFileSync(booksData, JSON.stringify(books, null, 2));
    res.end();
});

router.post('/returnBook/:id', auth, (req, res) => {
    const books = JSON.parse(fs.readFileSync(booksData)).map((book) => {
        if (book.id === +req.params.id) {
            if (req.id === book.takenBy) {
                (book.takenBy = null), (book.returnDate = null), (book.availability = "Yes");
            }
        }
        return book;
    });
    fs.writeFileSync(booksData, JSON.stringify(books, null, 2));
    res.end();
});

router.post('/editBook', auth, (req, res) => {
    let { bookId, author, title, releaseDate, availability, returnDate } = req.body;
    const books = JSON.parse(fs.readFileSync(booksData)).map((book) => {
        if (book.id === +bookId) {
            (book.author = author), (book.title = title), (book.releaseDate = releaseDate),
                (book.availability = availability), (book.returnDate = returnDate);
        }
        return book;
    });
    fs.writeFileSync(booksData, JSON.stringify(books, null, 2));
    res.redirect("/library");
});

module.exports = router;