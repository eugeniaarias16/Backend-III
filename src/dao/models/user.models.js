import mongoose from "mongoose";
import {hashPassword} from "../../utils/hashPassword.js";

const userSchema = new mongoose.Schema({
first_name:{
  type:String,
  required:[true,"The name is compulsory"],
  trim:true,
  maxLength:[100,"The name cannot exceed 100 characters"]
},
last_name:{
  type:String,
  required:[true,"The last name is compulsory"],
  trim:true,
  maxLength:[100,"The last name cannot exceed 100 characters"]
},
email:{
  type:String,
  required:[true,"The email is compulsory"],
  unique:true,
  trim:true,
  lowercase:true,
  match: [/^\S+@\S+\.\S+$/, "The email is not valid"],
},
age:{
  type:Number,
  min:[0,"The age cannot be less than 0"],
  max:[120,"The age cannot exceed 120"]
},
password:{
  type:String,
  required:[true,"The password is compulsory"],
},
role:{
  type:String,
  enum:["admin","user"],
  default:"user"
},
cart:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Cart",
  required:true
}
});


//Middleware(mongoose) para hashear el password antes de guardar el usuario
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();   // hasheamos si el password fue modificado o es nuevo

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    return next(error);
  }
});


export const User = mongoose.model("User", userSchema);