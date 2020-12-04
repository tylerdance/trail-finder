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
app.get('/savedTrails', isLoggedIn, function(req, res) {
    const currentUser = req.user.id;
    db.trails.findAll({
        where: {
            userId: currentUser
        }
    }).then((myTrails) => {
        console.log(myTrails);
        res.render('savedTrails', { savedTrails: myTrails })
    })
    .catch(err => {
        console.log(err);
    })
});

// Save trail with its details to the database
app.post('/savedTrails', isLoggedIn, (req, res) => {
    // const trailDetails = req.body;
    // console.log('trail id', trailDetails);
    console.log(req.user);
    db.trails.findOrCreate({
        where: {
            // trailId: trailDetails.id,
            summary: req.body.summary,
            difficulty: req.body.difficulty,
            stars: req.body.stars,
            location: req.body.location,
            length: req.body.length,
            high: req.body.high,
            low: req.body.low,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            ascent: req.body.ascent,
            descent: req.body.descent,
            conditionStatus: req.body.conditionStatus,
            conditionDate: req.body.conditionDate,
            url: req.body.url,
            name: req.body.name,
            userId: req.user.id,
            // trailId 
        }
        }).then((result) => {
        res.redirect('/savedTrails')
    })
})

// Delete saved trail
app.delete('/savedTrails/:id', isLoggedIn, async (req, res) => {
    console.log('something', req.params);
    const { id } = req.params;
    const deletedTrail = await db.trails.destroy({
        where: {
            id
        }
    }).catch(err => {
        console.log(err);
    }); 
    if (!deletedTrail) {
        console.log(err);
    } else {
        res.redirect('/savedTrails')
    }
})

module.exports = app;