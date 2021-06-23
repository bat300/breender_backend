import http from 'http';
import mongoose from 'mongoose';

import App from './src/app.js';
import { port, mongoURI } from './src/config.js';


// Set the port to the API.
App.set('port', port);

//Create a http server based on Express
const server = http.createServer(App);


// to the MongoDB database; then start the server
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(port))
    .catch(err => {
        console.log('Error connecting to the database', err.message);
        process.exit(err.statusCode);
    });


server.on('listening', () => {
    console.log(`API is running in port ${port}`);
});

server.on('error', (err) => {
    console.log('Error in the server', err.message);
    process.exit(err.statusCode);
});