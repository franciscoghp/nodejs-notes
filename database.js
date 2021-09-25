const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } )
    
        console.log('Data Base Online');
    
    } catch (error) {
        console.log(error);
        throw new Error('Error in the DataBase');
    }
}

module.exports = dbConnection