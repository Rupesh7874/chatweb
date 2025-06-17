const mongoose = require('mongoose');

const conectdb = async (req, res) => {
    try {
        mongoose.connect("mongodb://127.0.0.1/chatapp");
        console.log("db connected");
        
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = conectdb;


















// const mongoose = require('mongoose');

// // This module exports a function that sets up the MongoDB connection using Mongoose.
// module.exports = () => {
//   // Connect to MongoDB using the connection string and credentials from environment variables.
//   mongoose
//     .connect(process.env.MONGODB_URI, {
//       dbName: process.env.DB_NAME, // Name of the database to connect to.
//       user: process.env.DB_USER,   // Database user's name.
//       pass: process.env.DB_PASS,   // Database user's password.
//       useNewUrlParser: true,       // Use the new URL parser for MongoDB connection strings.
//       useUnifiedTopology: true,    // Use the new engine for MongoDB driver's topology management.
//     })
//     .then(() => {
//       console.log('Mongodb connected....') // Log on successful connection.
//     })
//     .catch(err => console.log(err.message)); // Log any errors that occur during connection.

//   // Event listener for successful connection to the database.
//   mongoose.connection.on('connected', () => {
//     console.log('Mongoose connected to db...');
//   });

//   // Event listener for any connection errors.
//   mongoose.connection.on('error', err => {
//     console.log(err.message); // Log the error message.
//   });

//   // Event listener for when the connection is disconnected.
//   mongoose.connection.on('disconnected', () => {
//     console.log('Mongoose connection is disconnected...');
//   });

//   // Event listener for SIGINT signal (typically sent from the terminal).
//   // This is used to handle graceful shutdown of the application.
//   process.on('SIGINT', () => {
//     mongoose.connection.close(() => { // Close the MongoDB connection.
//       console.log(
//         'Mongoose connection is disconnected due to app termination...'
//       );
//       process.exit(0); // Exit the process after the connection is closed.
//     });
//   });
// };
                