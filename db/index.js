const mongoose = require('mongoose')

async function startDB(){
    mongoose.connection.once("open", () => {
        console.log("DB connected successfully");
    })
    await mongoose.connect(`mongodb+srv://admin:admin@cluster0.yqt4eoh.mongodb.net/?retryWrites=true&w=majority`).catch(e => {
        console.log('DB connecting error: ', e);
    })

}

startDB();

module.exports = mongoose;