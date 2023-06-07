require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = require('./routers/index')
const fileUpload = require('express-fileupload')
const errorHandlingMiddleware = require('./middlewares/error_handling.middleware')

const app = express();
const PORT = process.env.PORT || 5001

app.use(express.json())
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
