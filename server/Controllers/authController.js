// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let { email, password, phone, firstName, lastName, avatar, role } = req.body;

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
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
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

        // Encrypt password 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Return JSON Web Token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWTPRIVATEKEY,
            { expiresIn: "30d" }
        );
        res.status(200).json({
            message: 'Success',
            data: user,
            accessToken
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const tokenPayload = { id: user._id, role: user.role };
        const token = jwt.sign(tokenPayload, process.env.JWTPRIVATEKEY);
        delete user.password;
        return res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logout = async (req, res) => {
    try {
        // There's no need to do anything specific to JWT logout on the server side
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



module.exports = { register, login , logout };
