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
    console.log(data.data);
    // .then(response => {
    //   // console.log(response.data);
      if (data.status === 200) {
        // console.log(response.data.trails);
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
            }
            return finalObject;
          })
      }
  }
  // console.log(finalArray);
  res.render('index', { finalArray, alerts: res.locals.alerts })
})

// Return "Saved Trails" page
app.get('/', function(req, res) {
  db.trails.findAll().then((myTrails) => {
    res.render('savedTrails', { savedTrails: myTrails })
  })
});

// Post trail and its detail to the database
// app.post('/', (req, res) => {
//   const trailDetails = {
//     name: req.body.name,
//     summary: req.body.summary,
//     difficulty: req.body.difficulty,
//     stars: req.body.stars,
//     location: req.body.location,
//     length: req.body.length,
//     high: req.body.high,
//     low: req.body.low,
//     latitude: req.body.latitude,
//     longitude: req.body.longitude,
//     ascent: req.body.ascent,
//     descent: req.body.descent,
//     conditionStatus: req.body.conditionStatus,
//     conditionDate: req.body.conditionDate,
//     url: req.body.url,
//     image: req.body.imgMedium,
//   }
//   db.trails.findOrCreate({
//     where: { trailDetails }
//   }).then((result) => {
//     res.redirect('/savedTrails')
//   })
// })


// // Home route
// app.get('/', (req, res) => {
//   const latitude = req.query.latitude
//   // console.log(latitude);
//   const longitude = req.query.longitude
//   console.log('longitude', longitude);
//   const maxDistance = req.query.maxDistance
//   let finalArray = []
//   const api = `https://www.mtbproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=3&key=${API_KEY}`
//   console.log(api);
  
//   if (latitude && longitude) {
//     console.log('randomString', latitude, longitude);
//       // axios.get(`https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&maxResults=30&key=${API_KEY}`)
//     axios.get(`https://www.mtbproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=3&key=${API_KEY}`)
//     .then(response => {
//       // console.log(response.data);
//       if (response.status === 200) {
//         // console.log(response.data.trails);
//         finalArray = response.data.trails.map(trailObject => {
//           const finalObject = {
//                 name: trailObject.name,
//                 summary: trailObject.summary,
//                 difficulty: trailObject.difficulty,
//                 stars: trailObject.stars,
//                 location: trailObject.location,
//                 length: trailObject.length,
//                 high: trailObject.high,
//                 low: trailObject.low,
//                 image: trailObject.imgMedium
//             }
//             return finalObject;
//           })
//           console.log('finalArray', finalArray);
//           // let len = response.data.trails.length;
//           //   let trailObject = response.data.trails[2] 
//           // console.log(finalObject);
//         }
        
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }
//   console.log(finalArray);
//   res.render('index', { finalArray, alerts: res.locals.alerts })
// })

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});


app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});

module.exports = server;
