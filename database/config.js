const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,  // Not supported since Mongoose 6, by default true
            // useFindAndModify: false // Not supported since Mongoose 6, by default false
        });

        console.log('Base de datos online');

    }
    catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}