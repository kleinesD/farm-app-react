const express = require('express');
const authController = require('../controllers/authController');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.post('/', authController.protect, inventoryController.addInventory);

router.patch('/:id', authController.protect, inventoryController.editInventory);

router.delete('/:id', authController.protect, inventoryController.deleteInventory);

router.get('/medication/inventory/one/:medicationId', authController.protect, inventoryController.getMedicationInventory);

router.delete('/medication/delete/many/:id', authController.protect, inventoryController.deleteRelatedMedication);

router.get('/medication/inventory/all/', authController.protect, inventoryController.getAllMedicationInventory);

router.get('/medication/records/all/', authController.protect, inventoryController.getAllMedicationRecords);

module.exports = router;