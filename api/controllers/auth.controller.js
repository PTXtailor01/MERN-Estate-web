import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import errorhandler from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next)=>{
  const { username, password, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newuser =new User({username,email,password: hashedPassword});

  try {
    await newuser.save();
    res.status(201).json('User added successfully')
    // console.log(res)
  } catch (error) {
    next(error);    
  }
}

export const signin = async(req,res,next)=>{
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    if (!validUser) return next(errorhandler(404,"User not found!"));

    const isMatch = await bcrypt.compareSync(password, validUser.password);
    if (!isMatch) return next(errorhandler(401,'Wrong credentials'));
    
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    const {password: pas, ...rest}=validUser._doc;
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
  } catch (error) {
    next(error)
  }

}

