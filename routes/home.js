const express = require('express')
const app = express.Router();
const axios = require('axios');
const db = require('../models')
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const isLoggedIn = require('../middleware/isLoggedIn')

// Home route
app.get('/', isLoggedIn, async (req, res) => {
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

// Save trail with its details to the database
app.post('/savedTrails', (req, res) => {
    const trailDetails = req.body;
    console.log('trail id', trailDetails);
    db.trails.findOrCreate({
        where: {
            id: req.body.id,
            name: trailDetails.name,
            summary: trailDetails.summary,
            difficulty: trailDetails.difficulty,
            stars: trailDetails.stars,
            location: trailDetails.location,
            length: trailDetails.length,
            high: trailDetails.high,
            low: trailDetails.low,
            latitude: trailDetails.latitude,
            longitude: trailDetails.longitude,
            ascent: trailDetails.ascent,
            descent: trailDetails.descent,
            conditionStatus: trailDetails.conditionStatus,
            conditionDate: trailDetails.conditionDate,
            url: trailDetails.url,
            image: trailDetails.imgMedium,
            id: trailDetails.id
        }
        }).then((result) => {
        res.redirect('/')
    })
})

module.exports = app;