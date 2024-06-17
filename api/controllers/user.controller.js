import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import errorHandler from '../utils/error.js';

export const test = async (req, res) => {
  res.json({
    message: `helleofja`
  })
};

export const updateUser = async (req,res,next)=>{
  // const userId = req.user?._id;
  // if (userId !== req.params._id) {
  //   return next(errorHandler(401, "You can only update your own account"));
  // }  
  try {
    if(req.body.password){
      req.body.password = bcryptjs.hashSync(req.body.password,10)
    }
    console.log(req.params)
    const updatedUser = await User.findByIdAndUpdate(req.params?.id , {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar
      }
    }, {new: true})

    const {password, ...rest} =  updatedUser._doc
    res.status(200).json(rest)

  } catch (error) {
    next(error)  
  }
}

export const deleteUser = async (req,res,next)=>{
  // const userId = req.user?._id;
  // if (userId !== req.params._id) {
  //   return next(errorHandler(401, "You can only delete your own account"));
  // } 
  try {
    console.log(req.params)
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been deleted")
  } catch (error) {
    next(error)
  }
}

export const getUserListings = async (req,res,next)=>{
  try {
    const listings = await Listing.find({userRef: req.params.id});
    res.status(200).json(listings )
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req,res,next) => {
  try {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }
  const {password:pass, ...rest} = user._doc;
  res.status(200).json(rest)
  }
  catch(error){
    next(error)
  }
}
