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
const db = require('./models');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

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

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


// Home route
app.get('/', async (req, res) => {
  const latitude = req.query.latitude
  // console.log(latitude);
  const longitude = req.query.longitude
  // console.log('longitude', longitude);
  const maxDistance = req.query.maxDistance
  let finalArray = []
  const api = `https://www.mtbproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=3&key=${API_KEY}`
  // console.log(api);
  
  if (latitude && longitude) {
    // console.log('randomString', latitude, longitude);
      // axios.get(`https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&maxResults=30&key=${API_KEY}`)
    const data = await axios.get(`https://www.mtbproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=3&key=${API_KEY}`)
    // console.log(data.data);
    // console.log(req.body.name);
    // .then(response => {
    //   // console.log(response.data);
      if (data.status === 200) {
        // console.log(data.data.trails);
        finalArray = data.data.trails.map(trailObject => {
          const finalObject = {
                name: trailObject.name,
                summary: trailObject.summary,
                difficulty: trailObject.difficulty,
                stars: trailObject.stars,
                location: trailObject.location,
                length: trailObject.length,
                high: trailObject.high,
                low: trailObject.low,
                latitude: trailObject.latitude,
                longitude: trailObject.longitude,
                ascent: trailObject.ascent,
                descent: trailObject.descent,
                conditionStatus: trailObject.conditionStatus,
                conditionDate: trailObject.conditionDate,
                url: trailObject.url,
                image: trailObject.imgMedium,
                id: trailObject.id
            }
            // console.log(finalObject);
            return finalObject;
          })
      }
  }
  // console.log(finalArray);
  res.render('index', { finalArray, alerts: res.locals.alerts })
});

// Return "Saved Trails" page
app.get('/savedTrails', function(req, res) {
  db.trails.findAll().then((myTrails) => {
    res.render('savedTrails', { savedTrails: myTrails })
  })
  .catch(err => {
    console.log(err);
  })
});

// Post trail and its detail to the database
app.post('/savedTrails', (req, res) => {
  const trailId = req.body.trailId
  console.log(trailId);
  db.trails.findOrCreate({
    where: { trailId }
  }).then((result) => {
    res.redirect('/savedTrails')
  })
})


// app.post('/', (req, res) => {
//   db.trails.findOrCreate({
//     where: {
//       summary: data.trails.summary,
//       difficulty: data.trails.difficulty,
//       stars: data.trails.stars,
//       location: data.trails.location,
//       length: data.trails.length,
//       high: data.trails.high,
//       low: data.trails.low,
//       latitude: data.trails.latitude,
//       longitude: data.trails.longitude,
//       ascent: data.trails.ascent,
//       descent: data.trails.descent,
//       conditionStatus: data.trails.conditionStatus,
//       conditionDate: data.trails.conditionDate,
//       url: data.trails.url,
//       image: data.trails.imgMedium,
//     }
//   }).then((result) => {
//     res.redirect('/savedTrails')
//   })
// })



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

module.exports = server;
