const express = require('express')
const router = express.Router();
const axios = require('axios');
const db = require('../models')
const SECRET_SESSION = process.env.SECRET_SESSION;
const API_KEY = process.env.API_KEY;
const isLoggedIn = require('../middleware/isLoggedIn')

// Home route
router.get('/', isLoggedIn, async (req, res) => {
    const latitude = req.query.latitude
    const longitude = req.query.longitude
    const maxDistance = req.query.maxDistance
    let finalArray = []
    if (latitude && longitude) {
        const data = await axios.get(`https://www.mtbproject.com/data/get-trails?lat=${latitude}&lon=${longitude}&maxDistance=${maxDistance}&maxResults=50&key=${API_KEY}`)
        if (data.status === 200) {
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
                return finalObject;
            })
        }
    }
    res.render('index', { finalArray, alerts: res.locals.alerts })
});

// Return "Saved Trails" page
router.get('/savedTrails', isLoggedIn, function(req, res) {
    const currentUser = req.user.id;
    db.trails.findAll({
        where: {
            userId: currentUser
        }
    }).then((myTrails) => {
        // console.log(myTrails);
        res.render('savedTrails', { savedTrails: myTrails })
    })
    .catch(err => {
        console.log(err);
    })
});

// Save trail with its details to the database
router.post('/savedTrails', isLoggedIn, (req, res) => {
    // const trailDetails = req.body;
    // console.log('trail id', trailDetails);
    // console.log(req.user);
    const storeResults = {
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
    }
    db.trails.findOrCreate({
        where: storeResults
        }).then((result) => {
        res.redirect('/savedTrails')
    })
    // localStorage.setItem(storeResults);
})

// Delete saved trail
router.delete('/savedTrails/:id', isLoggedIn, async (req, res) => {
    // console.log('something', req.params);
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

// Return update email page
router.get('/update', isLoggedIn, function(req, res) {
    // console.log('--- EDIT route ---');
    res.render('update')
})

// Update user email
router.put('/update', isLoggedIn, (req, res) => {
    // console.log('--- PUT route ---');
    // console.log(req.user.id);
    db.users.update({
        email: req.body.email
    }, {
        where: { id: req.user.id }
    }).then(() => {
        res.redirect('/profile')
    })
})

module.exports = router;