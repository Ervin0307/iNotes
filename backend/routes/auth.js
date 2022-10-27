const express = require('express');
const User= require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");


const JWT_SECRET = "ervogonbethebest";

//ROUTE 1: Create a user using Post w the url localhost:5000/api/auth/createuser;
router.post('/createuser', [
    body('name',"enter valid name").isLength({ min: 3 }),
    body('email',"enter valid email").isEmail(),
    body('password',"enter valid password").isLength({ min: 5 }),
], async (req, res) => { 
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success, error: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Else create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id:user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        success = true;
        res.json({success,authToken});
    } catch (error) {
        console.log(error.message);
        res.status(500).send(success,"Internal Server Error");
    }
})
    
//ROUTE 2: Authenticate a user using Post w the url localhost:5000/api/auth/login;
router.post('/login', [
    body('email',"enter valid email").isEmail(),
    body('password',"Password cannot be blank").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user =await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({success, error: "Login w correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({success, error: "Login w correct credentials" });
        }

        const data = {
            user: {
                id:user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success,authToken});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error")
    }
})

//ROUTE 3: get logged in details using post at /api/auth/getuser 
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user); 
    } catch (error) {
        console.log(error.message);
        res.status(500).send( "Internal Server Error")
    }
})
module.exports = router; 