const express = require('express');
const animalController = require('../controllers/animalController');
const authController = require('../controllers/authController');


const router = express.Router();

router.get('/', authController.protect, animalController.getAllAnimals)

router.get('/:animalId', authController.protect, animalController.getOneAnimal)

router.get('/animal-by-number/:number', authController.protect, animalController.getAnimalByNumber);

router.post('/lactation/:animalId', authController.protect, animalController.addLactation);

router.patch('/lactation/:animalId/:lactationId', authController.protect, animalController.updateLactation);

router.delete('/lactation/:animalId/:lactationId', authController.protect, animalController.deleteLactation);

router.post('/milking/:animalId', authController.protect, animalController.addMilkingResult);

router.patch('/milking/:animalId/:resultId', authController.protect, animalController.updateMilkingResult);

router.delete('/milking/:animalId/:resultId', authController.protect, animalController.deleteMilkingResult);

router.post('/weight/:animalId', authController.protect, animalController.addWeightResult);

router.patch('/weight/:animalId/:weightId', authController.protect, animalController.updateWeightResult);

router.delete('/weight/:animalId/:weightId', authController.protect, animalController.deleteWeightResult);

router.post('/insemination/:animalId', authController.protect, animalController.addInsemination);

router.patch('/insemination/:animalId/:inseminationId', authController.protect, animalController.updateInsemination);

router.delete('/insemination/:animalId/:inseminationId', authController.protect, animalController.deleteInsemination);

router.patch('/write-off/animal/:animalId', authController.protect, animalController.writeOffAnimal);

router.patch('/write-off/multiple-animals', authController.protect, animalController.writeOffMultipleAnimals);

router.patch('/bring-back-animal/:animalId', authController.protect, animalController.bringBackAnimal);

router.get('/milking-projection/:animalId', authController.protect, animalController.milkingProjectionData);

router.get('/check-by-field/:field/:value', authController.protect, animalController.checkAnimalByField);

router.get('/category/:category', authController.protect, animalController.getAnimalByCategory);

router.post('/note/:animalId', authController.protect, animalController.addNote);

router.patch('/note/:animalId/:index', authController.protect, animalController.updateNote);

router.delete('/note/:animalId/:noteId', authController.protect, animalController.deleteNote);

// TO KEEP
router.post('/animal/add', authController.protect, animalController.addOneAnimal);

router.patch('/animal/edit/:animalId', authController.protect, animalController.updateOneAnimal);

router.get('/parents/get', authController.protect, animalController.getAnimalParents);

router.get('/alive/get', authController.protect, animalController.getAllAliveAnimals);

router.get('/cows/lactations', authController.protect, animalController.getCowsWithLact);

module.exports = router;