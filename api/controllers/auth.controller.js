import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

async function signup(req, res) {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newuser =new User({username,email,password: hashedPassword});

  try {
    await newuser.save();
    res.status(201).json('User added successfully')
  } catch (error) {
    res.status(500).json(error.message);
  }
}

export default signup;
