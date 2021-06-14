import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { allowCrossDomain } from './middlewares/auth.middleware.js';

// import routes
import auth from './routes/auth.router.js';
import pet from './routes/pet.js';

const App = express();

// Adding Basic Middlewares
App.use(helmet());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(allowCrossDomain);


// Basic route
App.get('/', (req, res) => {
    res.json({
        name: 'SEBA Master: Breender Backend'
    });
});

// API routes
// @TODO: add further routes
App.use('/auth', auth);
App.use('/search', pet);

export default App;