require('dotenv').config()
const express = require('express');
const cors = require('cors')
const router = require('./routers/index')

const app = express();
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173','https://lms-client.onrender.com']
}))
app.use('/', router)

function start(){
    app.listen(PORT, ()=>{
        console.log(`Server started on port ${PORT}`)
    })
}

start();