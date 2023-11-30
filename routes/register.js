const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { notAuth } = require('../middleware/auth.js');
const express = require('express');
const router = express.Router();

const usersFile = './data/users.json';

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/reg', notAuth, async (req, res) => {
    const { name, password, password1 } = req.body;

    if (!(name && password && password1)) {
        return res.json('Please enter all fields');
    }
    if (password !== password1) {
        return res.render('register', { error: 'Passwords should match' });
    }

    const users = JSON.parse(fs.readFileSync(usersFile));

    const user = users.find((user) => user.name === name);
    if (user) {
        return res.render('register', { error: 'User with that email already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    if (!salt) {
        return res.render('register', { error: 'Something wrong with bcrypt.js' });
    }
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
        return res.render('register', { error: 'Error while hasing the password' });
    }

    const id = users[Object.keys(users).pop()].id + 1;

    const newUser = { id, name, password: hash };
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    const token = await jwt.sign(
        { id: newUser.id, username: newUser.name },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );
    if (!token) {
        return res.render('register', { error: 'Error while generating a token' });
    }

    res.cookie('token', token);
    res.redirect('/library');
});

module.exports = router;