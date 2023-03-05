// It contains the name, email, password, and picture>>>>>>>>>>>
const mongoose =require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    pic: {
        type:String, 
        required:false,
         default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            },
    // tokens: [
    //     {
    //         token: {
    //     type: String,
    //     reuired: true
    // }
    //     }
    // ]
}, {
    timestamps: true
});
// fucntion for matching password at login time taht user has entered the same password as he uses at registration time. 
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
// return await bcrypt.compare(enteredPassword, hashedPassword);
};

// make function to encrypt the password entered by user at registration time before saving into database>>>>>
// pre means befor saving the password 
// cannot use arrow function as we need to use this.password 
userSchema.pre("save", async function(next){
    if(!this.isModified){
        // if password is not modifed then move on to the next means don't run the code after if 
        next();
    }
    // otherwise we will generate new password 
     const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
//  const hashedPassword = await bcrypt.hash(req.body.password, salt);
//  this.password=hashedPassword;
})
const User = mongoose.model("User", userSchema);
module.exports = User;