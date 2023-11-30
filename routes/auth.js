const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { notAuth } = require('../middleware/auth.js');
const express = require('express');

const usersFile = './data/users.json';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('auth');
});

router.post('/login', notAuth, async (req, res) => {
    const { name, password } = req.body;

    if (!(name && password)) {
        return res.render('auth', { error: 'Please enter all fields' });
    }

    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find((user) => user.name === name);
    if (!user) {
        return res.render('auth', { error: 'There is not user with that email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('auth', { error: 'Wrong password' });
    }

    const token = await jwt.sign({ id: user.id, username: user.name }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
    if (!token) {
        return res.render('auth', { error: 'Error while generating a token' });
    }

    res.cookie('token', token);
    res.redirect('/library');
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth');
});

module.exports = router;
