// routes/auth.js
const router = require("express").Router();
const { register, login , logout} = require("../Controllers/authController");
const { body } = require("express-validator");

router.post(
    "/register",
    [
        body("firstName", "First Name is required").not().isEmpty(),
        body("lastName", "Last Name is required").not().isEmpty(),
        body("email", "Please include a valid email").isEmail(),
        body("password")
            .isStrongPassword()
            .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"),
        body('phone')
            .isMobilePhone()
            .withMessage('Please enter a valid phone number')
            .isLength({ min: 10, max: 13 })
            .withMessage('Phone number is wrong')
    ],
    register
);

router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
