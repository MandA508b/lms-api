require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = require('./routers/index')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const errorHandlingMiddleware = require('./middlewares/error_handling.middleware')
const courseIterationService = require('./services/course_iteration.service')
const Transaction = require('./models/transaction.model')

const app = express();
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173','https://exellence.space', 'https://www.exellence.space']
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
        '0 0 */1 * *',
        async function () {// function to add course iterations
            await courseIterationService.createIterationsMonthly()
        },
        null,
        true
    )

// let CronJob2 = require('cron').CronJob,
//     job2 = new CronJob(// cron options + func
//         '*/10 * * * *',
//         async function () {
//
//         },
//         null,
//         true
//     )
// let request = require('request');
//
// request.post(
//     'https://api.wayforpay.com/api',
//     { json: { "transactionType":"CHECK_STATUS",
//             "merchantAccount": "www_spe_org_ua",
//             "orderReference": "DH783023",
//             "merchantSignature": "b95932786cbe243a76b014846b63fe92",
//             "apiVersion": 1 } },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         }
//     }
// );

