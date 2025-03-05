const express = require('express');
const accRecordController = require('../controllers/accRecordController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/', authController.protect, accRecordController.createRecord);

router.patch('/:recordId', authController.protect, accRecordController.editRecord);

router.delete('/:recordId', authController.protect, accRecordController.deleteRecord);

router.post('/category/add', authController.protect, accRecordController.addAccCategory);

router.get('/records', authController.protect, accRecordController.getRecords);

module.exports = router;