const mongoose = require('mongoose')

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  

async function startDB(){
    mongoose.connection.once("open", () => {
        console.log("DB connected successfully");
    })
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?${process.env.DB_OPTIONS}`, options).catch(e => {
        console.log('DB connecting error: ', e);
    })

}

startDB();

module.exports = mongoose;