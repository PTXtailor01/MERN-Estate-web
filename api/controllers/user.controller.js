import mongoose from 'mongoose';

const test = async (req, res) => {
  try {
    const user = await mongoose.model('User').findOne({ username: req.body.username });
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default test;