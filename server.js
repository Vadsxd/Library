const express = require('express');
const path = require('path');
const dotevn = require('dotenv');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth');
const registerRouter = require('./routes/register');
const bookRouter = require('./routes/book');
const libraryRouter = require('./routes/library');
const addBookRouter = require('./routes/addBook');

dotevn.config();
const server = express();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
server.use('/public', express.static(path.join(__dirname, 'public')));
server.use('/auth', authRouter);
server.use('/register', registerRouter);
server.use('/book', bookRouter);
server.use('/library', libraryRouter);
server.use('/addBook', addBookRouter);

server.get('/', function (req, res) { res.redirect('/auth')});
server.get('*', function (req, res) { res.status(404).end('Page not found')});

module.exports = server;
