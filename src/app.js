import express from 'express';
import helmet from 'helmet';
import { allowCrossDomain } from './middlewares/auth.middleware.js';

// import routes
import authRouter from './routes/auth.router.js';

const App = express();

// Adding Basic Middlewares
App.use(helmet());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(allowCrossDomain);


// Basic route
App.get('/', (req, res) => {
    res.json({
        name: 'SEBA Master: Breender Backend'
    });
});
// API routes
// @TODO: add further routes
App.use('/auth', authRouter);


export default App;