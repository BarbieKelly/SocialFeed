const Sequelize = require('sequelize')
const UsersModel = require('./models/users')
const PostsModel = require('./models/posts')
const CommentsModel = require('./models/comments')
const sequelize = new Sequelize('socialfeed', 'postgres', '', {
    host: 'localhost',
    dialect: 'postgres',
    password: '$1lagoat',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })

const config = {
	host: 'localhost',
	port: 5432,
	database: 'socialfeed',
	user: 'postgres',
	password: '$1lagoat'
 };

const bcrypt = require('bcryptjs');

var express = require('express');
var bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const db = pgp(config);
var cors = require('cors')
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser')


// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.get('/register', function(req, res) {
    res.render('pages/register');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(cookieParser())

///// Models
const Users = UsersModel(sequelize, Sequelize);
const Posts = PostsModel(sequelize, Sequelize);
const Comments = CommentsModel(sequelize, Sequelize);

//Joins
Users.hasMany(Posts, {foreignKey: 'user_id'})
Posts.belongsTo(Users, {foreignKey: 'user_id'})


var currentdate = Date().slice(0, Date().length -33);

// GET /api/posts
app.get('/api/posts', function(req, res){
    Posts.findAll({include: [Users]}).then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });      
});

//GET /api/comments
app.get('/api/comments', function(req, res){
    Comments.findAll().then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });    
});

// GET /api/comments/user/:user_id
app.get('/api/comments/user/:user_id', function(req, res){
    let user_id = req.params.user_id;
    Comments.findAll({
        where: {
            user_id: user_id
        }
    }).then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    })
    .catch((e) => {
      console.error(e);
    });
});

//GET /api/comments/post/:post_id
app.get('/api/comments/post/:post_id', function(req, res){
    let post_id = req.params.post_id;
    Comment.findAll({
        where: {
            post_id: post_id
        }
    }).then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    })
    .catch((e) => {
      console.error(e);
    });
});

// GET /api/users

app.get('/api/users', function(req, res){
    Users.findAll() .then((results) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});

// GET /api/users/:user_id

app.get('/api/users/:user_id', function(req, res){
    let user_id = req.params.user_id;
    Users.findAll({
        where: {
            user_id: user_id
        }
    }).then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    })
    .catch((e) => {
      console.error(e);
    });
});

// GET /api/users/email/:email
app.get('/api/users/email/:email', function(req, res){
    let email = req.params.email;
    Users.findAll({
        where: {
            email: email
        }
    }).then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    })
    .catch((e) => {
      console.error(e);
    });
});

// GET /api/posts/:id
app.get('/api/posts/:id', function(req, res){
    let id = req.params.id;
    Posts.findAll({
        where: {
            id: id
        }
    }).then((results) => {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(results));
	  })
	  .catch((e) => {
		console.error(e);
	  });
});

// POST /api/posts
// curl --data "body=Hello World" http://localhost:3000/api/posts

app.post('/api/posts', function (req, res) {
	let data = {
        date: currentdate,
        body: req.body.body,
		imageurl : req.body.imageurl,
        color: req.body.color,
        user_id: req.body.user_id
    };
    Posts.create(data).then(function (post) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(post));
    })
	.catch((e) => {
        console.error(e);
    });
});
  
  //curl -X PUT -d body=hello -d imageurl=http://www.google.com http://localhost:3000/api/posts/31

  app.put('/api/posts/:id', function (req, res) {
    let id = req.params.id;
    let data = "";
    let query = "";
    if (req.body.body & req.body.imageurl) {
        data = {
            id: id,
            body: req.body.body,
            imageurl : req.body.imageurl,
        };
        query = "UPDATE posts SET body=${body}, imageurl=${imageurl} WHERE id=${id}";
    }
    else if (req.body.body) {
        data = {
            id: id,
            body: req.body.body,
        };
        query = "UPDATE posts SET body=${body} WHERE id=${id}";
    }
    else if (req.body.imageurl) {
        data = {
            id: id,
            imageurl : req.body.imageurl,
        };
        query = "UPDATE posts SET imageurl=${imageurl} WHERE id=${id}";
    }
    else {
        console.error(e);
    }
    db.one(query, data)
        .then((result) => {
            db.one(query, data)
                .then((result) => {
                    db.one("SELECT * FROM posts JOIN users ON posts.user_id=users.user_id WHERE posts.id=$1", [result.id])
                        .then((results) => {
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(results));
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                })
                .catch((e) => {
                    console.error(e);
                });
        })
        .catch((e) => {
            console.error(e);
        });
});

/////////////////////////////////
//curl -X DELETE http://localhost:3000/api/posts/100


app.delete('/api/posts/:id', function (req, res) {
    let id = req.params.id;
    let query = `DELETE FROM posts WHERE id=${id}`;
    db.result(query)
        .then((result) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        })
        .catch((e) => {
            console.error(e);
        });
});

//Example curl : curl --data "name=john&amp;email=john@example.com&password=abc123" http://localhost:3000/api/register
app.post('/api/register', function (req, res) {
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    if (data.name && data.email && data.password) {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);

        data['password'] = hash;

        Users.create(data).then(function(user){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        });;
    } else {
        res.status(434).send('Name, email and password is required to register')
    }
});

//Example curl : curl --data "name=john&amp;email=john@example.com&password=abc123" http://localhost:3000/api/login
app.post('/api/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if (email && password) {
        Users.findOne({
            where:{
                email: email
            },
        }).then((results) => {
            bcrypt.compare(password, results.password).then(function(matched) {
                if (matched) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(results));
                } else {
                    res.status(434).send('Email/Password combination did not match')
                }
            });
        }).catch((e) => {
            res.status(434).send('Email does not exist in the database')
        });
    } else {
        res.status(434).send('Both email and password is required to login')
    }
});

app.listen(3000, function(){
    console.log('Posts API is now listening on Port 3000');
});