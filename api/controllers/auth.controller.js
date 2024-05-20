import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import errorhandler from "../utils/error.js";

async function signup(req, res, next) {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newuser =new User({username,email,password: hashedPassword});

  try {
    await newuser.save();
    res.status(201).json('User added successfully')
  } catch (error) {
    next(error);    
  }
}

export default signup;
