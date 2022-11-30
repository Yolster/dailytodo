const express = require("express");
const bodyParser = require('body-parser');
const session = require("express-session");
const crypto = require('crypto-js');
const mysql = require('mysql');
const app = express();
const port = 3100;

var connection = mysql.createConnection({
  host     : "remotemysql.com",
  user     : "v3LNnDWOYN",
  password : "A3yjdppUuf",
  database : "v3LNnDWOYN"
});

connection.connect((err)=> {
  if (err){
      throw err;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.'); 
});

setInterval(async() => {
    const veri = await new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users`, function (err, result) {
            if (err)
                reject(err);
            resolve(result);
        });
    });
      }, 30000)
    

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'xAfeA23rop3mer3onrua3ebgrj3nr42kj3',
    resave: false,
    saveUninitialized: true
  }));
  

app.get('/', (req,res) => {
    if(req.session.username){
        return res.redirect('/dashboard')
    }
    res.render("index")
})

app.post('/login', async(req,res) => {
    const user = await new Promise((resolve, reject) => {connection.query(
        `SELECT * FROM users WHERE username=?`,[req.body.username],
        function (err, result) {if (err) reject(err);resolve(result);});});

    if(user == undefined){
        return res.redirect('/?err=1')
    }

    var bytes  = crypto.AES.decrypt(user[0].password, 'xAfeA23rop3mer3onrua3ebgrj3nr42kj3');
    var originalText = bytes.toString(crypto.enc.Utf8);
    if(req.body.password != originalText){
        return res.redirect('/?err=2')
    }

    req.session.username = req.body.username;
    return res.redirect('/dashboard')
})

app.get('/register', (req,res) => {
    if(req.session.username){
        return res.redirect('/dashboard')
    }
    res.render("register")
})

app.post('/register', async(req,res) => {
    const test = await new Promise((resolve, reject) => {connection.query(
          `SELECT * FROM users WHERE username=?`,[req.body.username],
          function (err, result) {if (err) reject(err);resolve(result);});});

    const test2 = await new Promise((resolve, reject) => {connection.query(
            `SELECT * FROM users WHERE email=?`,[req.body.email],
            function (err, result) {if (err) reject(err);resolve(result);});});

    if(test[0] != undefined){
        return res.redirect('/register?err=1')
    }      
    if(test2[0] != undefined){
        return res.redirect('/register?err=2')
    }

    if(req.body.username.length < 5 || req.body.password.length < 6 || req.body.email.length < 10){
        return res.redirect('/register')
    }

    var ciphertext = crypto.AES.encrypt(req.body.password, 'xAfeA23rop3mer3onrua3ebgrj3nr42kj3').toString();
    
    await new Promise((resolve, reject) => {connection.query(
        `INSERT INTO users(username,email,password) VALUE(?,?,?)`,[req.body.username,req.body.email,ciphertext],
        function (err, result) {if (err) reject(err);resolve(result);});});


    req.session.username = req.body.username;  
    return res.redirect('/dashboard?success?id=1')
})

app.get("/dashboard", async(req,res) => {
    if(!req.session.username){
        return res.redirect('/')
    }

    var d = new Date();
    var date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;

    const no = await new Promise((resolve, reject) => {connection.query(
        `SELECT * FROM todos WHERE username=? AND finished="no" AND date=?`,[req.session.username,date],
        function (err, result) {if (err) reject(err);resolve(result);});});

        const yes = await new Promise((resolve, reject) => {connection.query(
            `SELECT * FROM todos WHERE username=? AND finished="yes" AND date=?`,[req.session.username,date],
            function (err, result) {if (err) reject(err);resolve(result);});});

    res.render('dashboard', {
        no:no,
        yes:yes,
    })

})

app.post('/finished', async(req,res) => {
    if(!req.session.userid){
        return res.redirect('/dashboard')
    }

    const user = await new Promise((resolve, reject) => {connection.query(
        `SELECT * FROM users WHERE username=?`,[req.session.username],
        function (err, result) {if (err) reject(err);resolve(result);});});

    await new Promise((resolve, reject) => {connection.query(
        `UPDATE todos SET finished="yes" WHERE userID=? AND id=?`,[user[0].id,req.body.id],
        function (err, result) {if (err) reject(err);resolve(result);});});

    return res.redirect('/dashboard')
})

app.post('/notfinished', async(req,res) => {
    if(!req.session.userid){
        return res.redirect('/dashboard')
    }


    const user = await new Promise((resolve, reject) => {connection.query(
        `SELECT * FROM users WHERE username=?`,[req.session.username],
        function (err, result) {if (err) reject(err);resolve(result);});});


    await new Promise((resolve, reject) => {connection.query(
        `UPDATE todos SET finished="no" WHERE userID=? AND id=?`,[user[0].id,req.body.id],
        function (err, result) {if (err) reject(err);resolve(result);});});

    return res.redirect('/dashboard')
})

app.post('/add', async(req,res) => {
    if(!req.session.userid){
        return res.redirect('/dashboard')
    }

    if(req.body.add.length < 1) {
        return res.redirect('/dashboard')
    }

    var d = new Date();
    var date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;   

    await new Promise((resolve, reject) => {connection.query(
        `INSERT INTO todos(userID,todo,finished,date) VALUE(?,?,"no",?)`,[req.session.userid,req.body.add,date],
        function (err, result) {if (err) reject(err);resolve(result);});});

    return res.redirect('/dashboard')
})

app.get('/whatsnew', async(req,res) => {
    res.render('whatsnew')
})

app.get('/terms', async(req,res) => {
    res.render('terms')
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
