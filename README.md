# Off Road Trail Finder

This web app was designed to streamline the bike trail finding experience and to allow users to save their favorite trails, or trails they would like to try to their personal account for reference.

Off Road Trail Finder is pulling data from MTB Project's API (link below). Search from anywhere in the United States, up to 200 miles from your location. Get in depth trail detail such as trail length, elevation, conditions, and more.

Next steps for this project:
1. Make search available without sign in, but "save trail" functionality requires sign in.
2. Change cooridinate input to address input and build logic that will calculate coordinates for user.
3. Screensize responsivity.

## Local installation
1. Clone this repository
2. Run `npm i` to install local dependencies
3. Get an API key from https://www.mtbproject.com/data
4. Create a `.env` file in the root directory of the project
5. Add a `SECRET_SESSION` key and your `API_KEY` to the `.env`
6. Bypass authentication by removing `isLoggedIn` from the routes in `server.js`

## Code Walkthrough

Off Road Trail Finder uses Express for its core functionality. User profile routes can be found in `server.js` and all other routes can be found in the `home.js` controller in the routes directory. PostgreSQL was used to create a database to store user log in data and trail data saved by the user. Table relationships for user data and trail data can be found in the models directory.

The main route is an `async` function using axios to call the MTB Project API.

![img](./img/home-route-trail-finder.png)

`findOrCreate`, `findAll`, `destroy` and `update` functions were used to communicate with the database.

![img](./img/save-trail-route-trail-finder.png)

## Pre-build info

### ERD
![img](trail-finder-ERD.png)

### Wireframes
Homepage
![picture](./img/trail-finder-homepage-wireframe.png)

My List page
![picture](./img/trail-finder-saved-trails-page.png)
