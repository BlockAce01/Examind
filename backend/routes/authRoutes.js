const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
//route to register new user
router.post('/register', authController.register);

//route to login in existing user
router.post('/login', authController.login);

//add routes
module.exports = router;