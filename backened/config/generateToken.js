const jwt = require("jsonwebtoken");
const dotenv= require("dotenv");
dotenv.config();
const generateToken = (id) => {
  // console.log("hii")
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// const generateToken = async(id) => {
//   return await jwt.sign({ id }, "rupalisharmacghvjvjhkjfgfsxhjbvcxfghvc", {
//     expiresIn: "30d",
//   });
// };

module.exports = generateToken;
