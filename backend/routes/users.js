const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//create a pin
router.post("/register", async (req, res) => {
    try {
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUser.save();
        res.status(200).json(user._id);
    } catch (err) {
        res.status(500).json(err);
    }
});

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            const validated = await bcrypt.compare(req.body.password, user.password);
            if (validated) {
                res.status(200).json({ _id: user._id, username: user.username });
            }
            else {
                res.status(400).json("Password not correct!");
            }
        } else {
            res.status(400).json("Wrong username or password!");
        }
    } catch (err) {
      res.status(500).json(err);
    }
       
});



module.exports = router;