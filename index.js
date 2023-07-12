require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = require('./routers/index')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const errorHandlingMiddleware = require('./middlewares/error_handling.middleware')
const courseIterationService = require('./services/course_iteration.service')

const app = express();
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173','https://exellence.space']
}))
app.use(express.static(__dirname + '/src/videos'));
app.use('/', router)
app.use(fileUpload({
    createParentPath: true
}))
app.use(errorHandlingMiddleware)

function start(){
    app.listen(PORT, ()=>{
        console.log(`Server started on port ${PORT}`)
    })
}

start();

let CronJob = require('cron').CronJob,
    job = new CronJob(// cron options + func
        '0 0 0 1 * *',
        async function () {// function to add course iterations
            const course_iterations = await courseIterationService.createIterationsMonthly()
            console.log("added " + course_iterations + " iterations\n")
        },
        null,
        true
    )

