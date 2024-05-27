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

export const google = async(req,res,next)=>{
  try {
    const user = await User.findOne({email: req.body.email})
    if (user) {
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
      const {password: pass,...rest } = user._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
    else {
      const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatePassword, 10);
      const newUser = new User({
        username:req.body.name.split(" ").join("").toLowerCase()+ Math.random().toString(36).slice(-4),
        email:req.body.email,
        password:hashedPassword,
        avatar: req.body.imageUrl
      })
      await newUser.save();
      const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
      const {password: pass,...rest } = newUser._doc;
      res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    }
  } catch (error) {
    next(error)
  }
}

