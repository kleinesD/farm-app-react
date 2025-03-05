const express = require('express');
const authController = require('../controllers/authController');
const feedController = require('../controllers/feedController');

const router = express.Router();

router.post('/', authController.protect, authController.isLoggedIn, feedController.addRecord);

router.get('/:id', authController.protect, authController.isLoggedIn, feedController.getOneRecord);

router.get('/records/:feedId', authController.protect, authController.isLoggedIn, feedController.getFeedRecords);

router.patch('/:id', authController.protect, authController.isLoggedIn, feedController.editRecord);

router.delete('/:id', authController.protect, authController.isLoggedIn, feedController.deleteRecord);

router.get('/get/cost', authController.protect, authController.isLoggedIn, feedController.getCostOfFeed);

router.get('/get/records', authController.protect, authController.isLoggedIn, feedController.getFarmFeedRecords);

module.exports = router;