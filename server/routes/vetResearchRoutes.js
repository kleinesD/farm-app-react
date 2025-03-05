const express = require('express');
const authController = require('../controllers/authController');
const vetResearchController = require('../controllers/vetResearchController');

const router = express.Router();

router.post('/', authController.protect, vetResearchController.createVetResearch);

router.patch('/:id', authController.protect, vetResearchController.updateVetResearch);

router.delete('/:id', authController.protect, vetResearchController.deleteVetResearch);

router.get('/:id', authController.protect, vetResearchController.getOneVetResearch);

router.get('/animal/:animalId', authController.protect, vetResearchController.getAnimalVetResearch);

module.exports = router;