const mongoose = require("mongoose");
const colors = require("colors");
const dotenv= require("dotenv");
dotenv.config();

// 1>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// try {
//   const conn = await mongoose.connect(process.env.MONGO_URI, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//     // useFindAndModify: true,
//   });
//   console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

// } catch (error) {
//   console.log(`Error: ${error.message}`.red.bold);
//   process.exit();
// }
// const uri = 'mongodb+srv://admin:3Q8UP478562R5kd3@cluster0.xqz7ur9.mongodb.net/myChatApp?retryWrites=true&w=majority';
const connectDB = async () => {
  // 2>>>>
  mongoose.set('strictQuery', false);
  console.log("Connect");
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    // console.log('hello')
  });
};

module.exports = connectDB;
