# Weddio CS 554 Good Nodels

A wedding planning application built with Express.js, React, mongodb, AWS S3, Firebase, and other 3rd party packages.  
Created by Christian Szablewski-Paz, Tim Wang, Joseph Insalaco, Anisha Shin, and Jacob Roessler.

## To Run, Open two terminals

### Terminal One

```
cd ./backend
npm i
npm start
```

### Terminal Two

```
cd ./frontend
npm i
npm start
```

The database should already be seeded since we are using MongoDB Atlas but if you would like to seed the database, you can run 
```
npm run seed
```

Ensure Redis is running at the default port. All other integrations are cloud based, and a .env file will be required to run this.

Note: ImageMagick must be properly installed for the backend photo uploading.
Installation can be performed on MacOS via the HomeBrew package manager
```
brew install imagemagick
brew install graphicsmagick
```
