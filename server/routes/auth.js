const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const {verifyToken,verifyTokenAndAdmin} = require("./tokenVerification");
const cloudinary = require('cloudinary');
//add members
router.post(
    "/register", //verifyTokenAndAdmin ,
    [
        check("firstName", "first Name is requierd").not().isEmpty(),
        check("lastName", "last Name is requierd").not().isEmpty(),
        check("email", " please include a vaild email ").isEmail(),
        check("password", "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number").isStrongPassword({
        }),
        check('phone').isMobilePhone()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let {email, password, phone, firstName, lastName, avatar , role } = req.body;
        
        // Remove any non-numeric characters from the phone number
        phone = phone.replace(/\D/g, '');

       // Add the country code based on the starting digit of the phone number
       if (phone.startsWith('+')) {
        // Phone number already includes country code, do nothing
    } else if (phone.startsWith('0')) {
        phone = '+2' + phone;
    } else if (phone.startsWith('1')) {
        phone = '+20' + phone;
    } else {
        // Assume no country code, add +
        phone = '+' + phone;
    }

        try {
            //check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
            }
            user = new User({
                email,
                password,
                phone,
                firstName,
                lastName,
                avatar,
                role
            });

            //encrypt password 
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            //return jsonwebtoken
            const accessToken = jwt.sign({
                id: user._id,
                role: user.role, // Replace isAdmin with role
              },
                process.env.JWTPRIVATEKEY, { expiresIn: "30d" });
            res.status(200).json({ accessToken });

        } catch (error) {
            console.error(error.message)
            res.status(500).send('server error')
        }
    }
);

//LOGIN

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
        // Include isAdmin property in the token payload if user is an admin
        const tokenPayload = { id: user._id, role: user.role };
        const token = jwt.sign(tokenPayload, process.env.JWTPRIVATEKEY);
        delete user.password;
        return res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;