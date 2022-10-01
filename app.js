require('dotenv').config();
const mongoose = require('mongoose');
const experss = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const md5 = require('md5');
const app = experss();


app.use(experss.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/againNewUserDB');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String
});

// here we will use the hash functino , to convert the password into the hash
// to make it more secure. It is impossible to go back to the normal form from the
// hash to the password.

// Going forward it take mili seconds but , going backward it take more than 2 years.



// Put this userschema before teh mongoose model
const User = mongoose.model("User", UserSchema);

// We use the secret to encrypt our data.

// Read this book named - the Code Book , The secret history of codes and code-breaking. Simon Singh.

console.log(process.env.SECRET);

app.get('/', function (req, res) {
    res.render('home');
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});

console.log(md5("12345"));


app.post('/register', function (req, res) {
    const newUser = new User({
        // name: req.body.name,
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function (err) {
        if (err) {
            console.log("This is the error : " + err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.render("wrong");
                }
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server is up and running on port 3000");
});