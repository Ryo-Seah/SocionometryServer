import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

//Register User
export const register = async  (req, res) => {
    try {
      const { 
          firstName, 
          lastName, 
          email, 
          password,
          picturePath,
          friends,
          location,
          occupation 
          } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: passwordHash,
          picturePath,
          friends,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() *1000), //TODO , add real fucntion
          impressions: Math.floor(Math.random() *1000),  //TODO 
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
}

//Logging in
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json("User not found");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json("Invalid credentials");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}