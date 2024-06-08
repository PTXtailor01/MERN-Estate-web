import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import errorHandler from '../utils/error.js';

export const test = async (req, res) => {
  res.json({
    message: `helleofja`
  })
};

export const updateUser = async (req,res)=>{
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
    console.log(error)  
  }
}
