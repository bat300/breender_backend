import express from "express"
import helmet from "helmet"
import { allowCrossDomain } from "./middlewares/auth.middleware.js"
import morgan from "morgan"

// import routes
import petRouter from './routes/pet.router.js';
import authRouter from './routes/auth.router.js';
import subscriptionRouter from './routes/subscription.router.js';
import userRouter from './routes/user.router.js';
import transactionRouter from './routes/transaction.router.js';
import messageRouter from "./routes/message.router.js"
import conversationRouter from "./routes/conversation.router.js"

const App = express()

// Adding Basic Middlewares
App.use(helmet())
App.use(express.json())
App.use(express.urlencoded({ extended: false }))
App.use(allowCrossDomain)
App.use(morgan("tiny"))

// Basic route
App.get("/", (req, res) => {
    res.json({
        name: "SEBA Master: Breender Backend",
    })
})
// API routes
// @TODO: add further routes
<<<<<<< HEAD
App.use("/pets", petRouter)
App.use("/auth", authRouter)
App.use("/user", userRouter)
App.use("/transaction", transactionRouter)
App.use("/messages", messageRouter)
App.use("/conversations", conversationRouter)
=======
App.use('/pets', petRouter);
App.use('/auth', authRouter);
App.use('/subscription', subscriptionRouter);
App.use('/user', userRouter);
App.use('/transaction', transactionRouter);
>>>>>>> 2aef5edbc1745f1bb64f5f86a8e5f8d1617cf50c

export default App
