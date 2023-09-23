import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    role:{
        type:String,
        required:[true,"Role is required"],
        enum:["admin","donar","organisation","hospital"],
    },
    name:{
        type: String,
        required: function(){
            if(this.role === "user" || this.role === "admin"){
                return false;
            }
            return false;
        }
    },
    organizationName:{
        type: String,
        required: function(){
            if(this.role === "organisation"){
                return true;
            }
            return false;
        }
    },
    hospitalName:{
        type: String,
        required: function(){
            if(this.role === "hospital"){
                return true;
            }
            return false;
        }
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is require"],
        minlength: [6, "Password length should be greater than 6 character"],
        select: true,
    },
    websites:{
        type: String,
    },
    address:{
        type: String,
        required: [true, "Address is required"],
    },
    phone:{
        type: String,
        required: [true, "Phone Number is required"],
    }
},{timestamps:true});

userSchema.pre("save", async function () {
    if (!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  //compare password
  userSchema.methods.comparePassword = async function (userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
  };

  userSchema.methods.createJWT = function () {
    return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

export default mongoose.model("users", userSchema);