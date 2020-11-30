require('dotenv').config();
const express = require('express');
const axios = require('axios');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const app = express();

// isLoggedIn middleware
const isLoggedIn = require('./middleware/isLoggedIn');
const { default: Axios } = require('axios');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// const latitude = 




// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}

app.use(session(sessionObject));

// Initialize passport and run through middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
// Using flash throughout app to send temp messages to user
app.use(flash());

// Messages that will be accessible to every view
app.use((req, res, next) => {
  // Before every route, we will attach a user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// // Home route
// app.get('/', (req, res) => {
//   // console.log(res.locals.alerts);
//   res.render('index', { alerts: res.locals.alerts });
// });

// homepage
app.get('/', (req, res) => {
  axios.get(`https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&maxResults=3&key=${API_KEY}`)
  .then(response => {
    // console.log(response.data);
    if (response.status === 200) {
        // console.log(response.data.trails);
        let len = response.data.trails.length;
          let trailObject = response.data.trails[0,2]
          const finalObject = {
            name: trailObject.name,
            summary: trailObject.summary,
            difficulty: trailObject.difficulty,
            stars: trailObject.stars,
            location: trailObject.location,
            length: trailObject.length,
            high: trailObject.high,
            low: trailObject.low,
            image: trailObject.imgMedium
        }
        console.log(finalObject);
        res.render('index', { finalObject, alerts: res.locals.alerts })
    }
  })
  .catch(err => {
    console.log(err);
  })
})

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});


app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

module.exports = server;
