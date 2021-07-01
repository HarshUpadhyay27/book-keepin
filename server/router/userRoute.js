const express = require("express");
const asyncHandler = require("express-async-handler");
const authMiddleware = require("../middleware/authMiddleware");
const route = express.Router();
const User = require("../models/User");
const genrateToken = require("../util/genrateToken");

route.post(
  "/api/user/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      throw new Error("User Exist");
    }
    const userCreated = await User.create({ name, email, password });
    res.json({
      _id: userCreated._id,
      name: userCreated.name,
      password: userCreated.password,
      email: userCreated.email,
      token: genrateToken(userCreated._id),
    });
  })
);

route.post(
  "/api/user/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user && (await user.isPasswordMatch(password))) {
      // res.send(user)
      res.status(200);

      res.json({
        _id: user._id,
        name: user.name,
        password: user.password,
        email: user.email,
        token: genrateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
  })
);

route.put(
  "/api/user/update",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.user.password) {
        user.password = req.body.password || user.password;
      }

      const updateUser = await user.save();

      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        password: updateUser.password,
        email: updateUser.email,
        token: genrateToken(updateUser._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
  })
);

route.delete("/api/user/:id", (req, res) => {
  res.send("delete sucessfully");
});

route.get("/api/user/", authMiddleware, asyncHandler(async(req, res) => {
  const users = await User.find()
  if(user){
    res.status(200).json(users)
  }else{
    res.status(500)
    throw new Error('No User Found at the moment')
  } 
}));

//profile route
route.get('/api/user/profile', authMiddleware, asyncHandler(async (req, res)=>{
  try {
    const user = await User.findById(req.user._id).populate('books')
    if(!user) throw new Error("You dont have a account")
    res.status(200)
    res.send(user)
  } catch (error) {
    throw new Error("server error")
  }
}))

module.exports = route;