const moment = require('moment');
const Animal = require('../models/animalModel');
const Vet = require('../models/vetModel');
const Farm = require('../models/farmModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const synaptic = require('synaptic');
const { Architect, Trainer } = synaptic;

let updateCurrentInfoOneAnimal = catchAsync(async (animal) => {
  if (animal.gender === 'female') {
    let lastLact = animal.lactations.at(-1);
    let lastInsem = animal.inseminations.at(-1);

    /* Empty current info if nothing happens */
    animal.currentInfoAB.message = ``;
    animal.currentInfoAB.status = 'regular';

    /* Regular lactation info */
    if (lastLact && lastLact.finishDate === null) {
      animal.currentInfoAB.message = `Лактация: ${lastLact.number} | День: ${Math.round((Date.now() - lastLact.startDate.getTime()) / 1000 / 60 / 60 / 24)}`;
      animal.currentInfoAB.status = 'regular';
    }

    /* Insemination info */
    if (lastLact) {
      if (lastLact && !lastInsem || lastInsem.date > lastLact.startDate && !lastInsem.success || lastInsem.date < lastLact.startDate) {
        if (Date.now() < lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000 && Date.now() >= lastLact.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) {
          animal.currentInfoAB.message = `Пора осеменять через: ${Math.round(((lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000) - Date.now()) / 1000 / 60 / 60 / 24)} дн.`;
          animal.currentInfoAB.status = 'on-schedule';
        } else if (Date.now() > lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000) {
          animal.currentInfoAB.message = `Перестой: ${Math.round((Date.now() - (lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000)) / 1000 / 60 / 60 / 24)} дн.`;
          animal.currentInfoAB.status = 'urgent';
        }
      }
    }

    if (!lastLact && !lastInsem || !lastLact && !lastInsem.success) {
      if (Date.now() < animal.birthDate.getTime() + 15 * 30 * 24 * 60 * 60 * 1000 && Date.now() >= animal.birthDate.getTime() + 14 * 30 * 24 * 60 * 60 * 1000) {
        animal.currentInfoAB.message = `Пора осеменять`;
        animal.currentInfoAB.status = 'on-schedule';
      } else if (Date.now() > animal.birthDate.getTime() + 15 * 30 * 24 * 60 * 60 * 1000) {
        animal.currentInfoAB.message = `Пора осеменять`;
        animal.currentInfoAB.status = 'urgent';
      }
    }

    if (lastInsem && lastInsem.success === undefined) {
      animal.currentInfoAB.message = `Не подтвержденное осеменение: ${Math.round((Date.now() - lastInsem.date.getTime()) / 1000 / 60 / 60 / 24)} дн. назад`;
      animal.currentInfoAB.status = 'regular';
    }

    /* Calving info */
    if (lastInsem && lastInsem.success) {
      if (!lastLact || lastInsem.date > lastLact.startDate) {
        if (Date.now() > lastInsem.date.getTime() + 223 * 24 * 60 * 60 * 1000) {
          animal.currentInfoAB.message = `Отел через: ${Math.round(((lastInsem.date.getTime() + 283 * 24 * 60 * 60 * 1000) - Date.now()) / 1000 / 60 / 60 / 24)} дн.`;
          animal.currentInfoAB.status = 'on-schedule';
        }
      }
    }

    await animal.save();
  } else if (animal.gender === 'male') {
    /* Empty current info if nothing happens */
    animal.currentInfoAB.message = ``;
    animal.currentInfoAB.status = 'regular';

    await animal.save();
  }
})

exports.getAllAnimals = catchAsync(async (req, res, next) => {
  const animals = await Animal.find({ farm: req.user.farm });

  res.status(200).json({
    status: 'success',
    counter: animals.length,
    data: {
      animals
    }
  });
});

exports.getOneAnimal = catchAsync(async (req, res, next) => {
  const animal = await Animal.findById(req.params.animalId).populate('motherCalves').populate('fatherCalves');
  const problem = await Vet.findOne({ category: 'problem', cured: { $ne: true }, animal: animal._id }).sort('-date').limit(1);

  res.status(200).json({
    status: 'success',
    data: {
      animal,
      problem
    }
  });
});

exports.getAnimalByNumber = catchAsync(async (req, res, next) => {
  const animal = await Animal.findOne({ farm: req.user.farm, number: req.params.number });

  if (animal) {
    res.status(200).json({
      status: 'success',
      data: {
        animal
      }
    });
  } else {
    res.status(200).json({
      status: 'not-found (success)'
    });

  }

});

exports.addOneAnimal = catchAsync(async (req, res, next) => {
  req.body.farm = req.user.farm;
  const animal = await Animal.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateOneAnimal = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate(req.params.animalId, req.body);

  animal.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await animal.save();

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.addLactation = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { lactations: req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { lactations: { $each: [], $sort: { startDate: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateLactation = catchAsync(async (req, res, next) => {
  console.log('here');
  let animal = await Animal.updateOne({ _id: req.params.animalId, 'lactations._id': req.params.lactationId }, { $set: { 'lactations.$': req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { lactations: { $each: [], $sort: { startDate: 1 } } } });

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.deleteLactation = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate({ _id: req.params.animalId }, { $pull: { lactations: { _id: req.params.lactationId } } })

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  })
});

exports.addMilkingResult = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { milkingResults: req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { milkingResults: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateMilkingResult = catchAsync(async (req, res, next) => {
  let animal = await Animal.updateOne({ _id: req.params.animalId, 'milkingResults._id': req.params.resultId }, { $set: { 'milkingResults.$': req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { milkingResults: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.deleteMilkingResult = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate({ _id: req.params.animalId }, { $pull: { milkingResults: { _id: req.params.resultId } } })

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  })
});

exports.addWeightResult = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { weightResults: req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { lactations: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateWeightResult = catchAsync(async (req, res, next) => {
  let animal = await Animal.updateOne({ _id: req.params.animalId, 'weightResults._id': req.params.weightId }, { $set: { 'weightResults.$': req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { lactations: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.deleteWeightResult = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate({ _id: req.params.animalId }, { $pull: { weightResults: { _id: req.params.weightId } } })

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  })
});

exports.addInsemination = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  let animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { inseminations: req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { inseminations: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateInsemination = catchAsync(async (req, res, next) => {
  let animal = await Animal.updateOne({ _id: req.params.animalId, 'inseminations._id': req.params.inseminationId }, { $set: { 'inseminations.$': req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { inseminations: { $each: [], $sort: { date: 1 } } } });


  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.deleteInsemination = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate({ _id: req.params.animalId }, { $pull: { inseminations: { _id: req.params.inseminationIdd } } })

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  })
});

exports.updateCurrentInfo = catchAsync(async (req, res, next) => {
  let cows = await Animal.find({ gender: 'female' });
  let bulls = await Animal.find({ gender: 'male' });

  cows.forEach(async (cow) => {
    let lastLact = cow.lactations.at(-1);
    let lastInsem = cow.inseminations.at(-1);

    /* Empty current info if nothing happens */
    cow.currentInfoAB.message = ``;
    cow.currentInfoAB.status = 'regular';

    /* Regular lactation info */
    if (lastLact && lastLact.finishDate === null) {
      cow.currentInfoAB.message = `Лактация: ${lastLact.number} | День: ${Math.round((Date.now() - lastLact.startDate.getTime()) / 1000 / 60 / 60 / 24)}`;
      cow.currentInfoAB.status = 'regular';
    }

    /* Insemination info */
    if (lastLact) {
      if (lastLact && !lastInsem || lastInsem.date > lastLact.startDate && lastInsem.success !== 'true' || lastInsem.date < lastLact.startDate) {
        if (Date.now() < lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000 && Date.now() >= lastLact.startDate.getTime() + 30 * 24 * 60 * 60 * 1000) {
          cow.currentInfoAB.message = `Пора осеменять через: ${Math.round(((lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000) - Date.now()) / 1000 / 60 / 60 / 24)} дн.`;
          cow.currentInfoAB.status = 'on-schedule';
        } else if (Date.now() > lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000) {
          cow.currentInfoAB.message = `Перестой: ${Math.round((Date.now() - (lastLact.startDate.getTime() + 60 * 24 * 60 * 60 * 1000)) / 1000 / 60 / 60 / 24)} дн.`;
          cow.currentInfoAB.status = 'urgent';
        }
      }
    }

    if (!lastLact && !lastInsem || !lastLact && lastInsem.success !== 'false') {
      if (Date.now() < cow.birthDate.getTime() + 15 * 30 * 24 * 60 * 60 * 1000 && Date.now() >= cow.birthDate.getTime() + 14 * 30 * 24 * 60 * 60 * 1000) {
        cow.currentInfoAB.message = `Пора осеменять`;
        cow.currentInfoAB.status = 'on-schedule';
      } else if (Date.now() > cow.birthDate.getTime() + 15 * 30 * 24 * 60 * 60 * 1000) {
        cow.currentInfoAB.message = `Пора осеменять`;
        cow.currentInfoAB.status = 'urgent';
      }
    }

    if (lastInsem && lastInsem.success === 'undefined') {
      cow.currentInfoAB.message = `Не подтвержденное осеменение: ${Math.round((Date.now() - lastInsem.date.getTime()) / 1000 / 60 / 60 / 24)} дн. назад`;
      cow.currentInfoAB.status = 'regular';
    }

    /* Calving info */
    if (lastInsem && lastInsem.success === 'true') {
      if (!lastLact || lastInsem.date > lastLact.startDate) {
        if (Date.now() < lastInsem.date.getTime() + 223 * 24 * 60 * 60 * 1000) {
          cow.currentInfoAB.message = `Отел через: ${Math.round(((lastInsem.date.getTime() + 283 * 24 * 60 * 60 * 1000) - Date.now()) / 1000 / 60 / 60 / 24)} дн.`;
          cow.currentInfoAB.status = 'on-schedule';
        }
      }
    }

    await cow.save();
  });

  bulls.forEach(async (bull) => {
    /* Empty current info if nothing happens */
    bull.currentInfoAB.message = ``;
    bull.currentInfoAB.status = 'regular';

    await bull.save();
  });

  let animals = await Animal.find();

  /* animals.forEach(async (animal) => {
    if(true) {
      animal.mainPhoto = 'default-cow-image.png'

      await animal.save()
    }
  }); */
})

exports.writeOffAnimal = catchAsync(async (req, res, next) => {
  req.body.status = 'diseased';

  const animal = await Animal.findByIdAndUpdate(req.params.animalId, req.body);

  /* Change the balance in accounting block */

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.writeOffMultipleAnimals = catchAsync(async (req, res, next) => {
  let allAnimals = [];
  const animalsObjects = req.body.animalsObjects;

  animalsObjects.forEach(async obj => {
    obj.body.status = 'diseased';

    let animal = await Animal.findByIdAndUpdate(obj.animalId, obj.body);

    allAnimals.push(animal);
  });

  /* Change the balance in accounting block */

  res.status(200).json({
    status: 'success',
    data: {
      allAnimals
    }
  })
});

exports.bringBackAnimal = catchAsync(async (req, res, next) => {
  const animal = await Animal.findById(req.params.animalId);

  animal.status = 'alive';
  animal.writeOffDate = undefined;
  animal.writeOffReason = undefined;
  animal.writeOffMoneyReceived = undefined;
  animal.writeOffNote = undefined;
  await animal.save();
  /* Do something to extract money received from the farm account */

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.milkingProjectionData = catchAsync(async (req, res, next) => {
  let animal = await Animal.findById(req.params.animalId);
  let farmAnimals = await Animal.find({ farm: animal.farm, gender: 'female' });
  let allAnimals = await Animal.find({ gender: 'female' })

  res.status(200).json({
    status: 'success',
    data: {
      animal,
      farmAnimals,
      allAnimals
    }
  });
});

exports.checkAnimalByField = catchAsync(async (req, res, next) => {
  let animal;
  if (req.params.field === 'number') animal = await Animal.findOne({ number: req.params.value });
  if (req.params.field === 'name') animal = await Animal.findOne({ name: req.params.value });

  let exist = false;
  if (animal) exist = true;

  res.status(200).json({
    status: 'success',
    data: {
      exist
    }
  })
});

exports.getAnimalByCategory = catchAsync(async (req, res, next) => {
  let animals;
  if (req.params.category !== 'all') {
    animals = await Animal.find({ farm: req.user.farm, category: req.params.category });
  } else {
    animals = await Animal.find({ farm: req.user.farm, $or: [{ category: { $exists: false } }, { category: 'all' }, { catrgory: null }] })
  }
  res.status(200).json({
    status: 'success',
    data: {
      animals
    }
  });
});

exports.addNote = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id

  let animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { notes: req.body } });

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { notes: { $each: [], $sort: { date: 1 } } } });

  res.status(200).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.updateNote = catchAsync(async (req, res, next) => {
  let animal = await Animal.findById(req.params.animalId);

  animal.notes[req.params.index].text = req.body.text;
  animal.notes[req.params.index].date = req.body.date;

  animal.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await animal.save();

  animal = await Animal.findOneAndUpdate({ _id: req.params.animalId }, { $push: { notes: { $each: [], $sort: { date: 1 } } } });

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
  const animal = await Animal.findByIdAndUpdate({ _id: req.params.animalId }, { $pull: { notes: { _id: req.params.noteId } } })

  res.status(203).json({
    status: 'success',
    data: {
      animal
    }
  })
});

exports.animalTracker = catchAsync(async (req, res, next) => {
  const animals = await Animal.find().populate('farm');

  animals.forEach(async animal => {

    /* Write of cuz of age */
    /* Write of cuz of weight */
    animal.weightResults.sort((a, b) => b.date - a.date);
    if (animal.gender === 'male') {

      if (animal.weightResults.length > 0) {
        if (animal.weightResults[0].result >= animal.farm.butcherWeight.male) {
          animal.butcherSuggestion = true;
          animal.butcherSuggestionReason = 'weight';
          await animal.save();
        } else if (animal.weightResults[0].result < animal.farm.butcherWeight.male && animal.butcherSuggestionReason !== 'age') {
          animal.butcherSuggestion = false;
          animal.butcherSuggestionReason = undefined;
          await animal.save();
        }
      }
      if (new Date() > new Date(moment(animal.birthDate).add(animal.farm.butcherAge.male, 'month'))) {
        animal.butcherSuggestion = true;
        animal.butcherSuggestionReason = 'age';
        await animal.save();
      }

    }
    if (animal.gender === 'female') {

      if (animal.weightResults.length > 0) {
        if (animal.weightResults[0].result >= animal.farm.butcherWeight.female) {
          animal.butcherSuggestion = true;
          animal.butcherSuggestionReason = 'weight';
          await animal.save();
        } else if (animal.weightResults[0].result < animal.farm.butcherWeight.female && animal.butcherSuggestionReason !== 'age') {
          animal.butcherSuggestion = false;
          animal.butcherSuggestionReason = undefined;
          await animal.save();
        }
      }
      if (new Date() > new Date(moment(animal.birthDate).add(animal.farm.butcherAge.female, 'month'))) {
        animal.butcherSuggestion = true;
        animal.butcherSuggestionReason = 'age';
        await animal.save();
      }


    }
    /* Write of cuz of hard to inseminate */
    animal.lactations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    let insemTotal = 0;
    let insemSuccess = 0;
    animal.inseminations.forEach(insem => {
      insemTotal++;
      if (insem.success) insemSuccess++;
    });

    if (insemSuccess / insemTotal < 0.20 && animal.lactations.at(-1).finishDate) {
      animal.butcherSuggestion = true;
      animal.butcherSuggestionReason = 'insemination';
      await animal.save();
    }


    /* Write of cuz of constantly sick */

  });
});

exports.getAnimalParents = catchAsync(async (req, res, next) => {
  const females = await Animal.find({ farm: req.user.farm, gender: 'female', birthDate: { $lte: new Date(moment().subtract(6, 'month')) } });
  const males = await Animal.find({ farm: req.user.farm, gender: 'male', birthDate: { $lte: new Date(moment().subtract(8, 'month')) } });

  res.status(200).json({
    status: 'success',
    data: {
      males,
      females
    }
  });
});

exports.getAllAliveAnimals = catchAsync(async (req, res, next) => {
  const animals = await Animal.find({ farm: req.user.farm, status: 'alive' });

  res.status(200).json({
    status: 'success',
    counter: animals.length,
    data: {
      animals
    }
  });
});

exports.getCowsWithLact = catchAsync(async (req, res, next) => {
  const cows = await Animal.find({ status: 'alive', farm: req.user.farm, gender: 'female', lactations: { $exists: true, $ne: [] } });

  res.status(200).json({
    status: 'success',
    data: {
      cows
    }
  })
});


exports.createAnimalProjection = catchAsync(async () => {
  const animal = await Animal.findById('628c8e193108dae81ddad038');

  if (!animal) return;

  const trainingSet = [];

  animal.milkingResults.forEach(res => {
    const lactation = animal.lactations.find(lact => lact.number === res.lactationNumber);
    const result = res.result;
    const month = Math.round((new Date(res.date).getTime() - new Date(lactation.startDate).getTime()) / 1000 / 60 / 60 / 24 / 30);
    const age = Math.round((new Date(res.date).getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 365);

    trainingSet.push({ input: [age, lactation.number, month], output: [result] });
  });

  trainingSet.sort((a, b) => {
    if(a.input[1] === b.input[1]) {
      return a.input[2] - b.input[2];
    }

    return a.input[1] - b.input[1];
  });

  // Create the network
  const network = new Architect.Perceptron(3, 8, 1); // 3 inputs (age, lactation, month), 8 hidden neurons, 1 output (milk)

  // Create a trainer
  const trainer = new Trainer(network);

  // Max values for normalization
  const maxValues = { age: 10, lactation: 5, month: 12 };

  // Normalize data
  const normalizedTrainingSet = trainingSet.map(({ input, output }) => ({
    input: input.map((value, index) => value / Object.values(maxValues)[index]),
    output: output.map(value => value / 30), // Assuming max milk yield is ~30 litres
  }));

  // Train the network
  trainer.train(normalizedTrainingSet, {
    rate: 0.1,
    iterations: 20000,
    error: 0.005,
    cost: Trainer.cost.MSE,

  });

  // Test the network
  const toProject = [[8, 5, 2], [8, 5, 3], [8, 5, 4]];

  toProject.forEach(proj => {
    const normalizedInput = proj.map((value, index) => value / Object.values(maxValues)[index]);
    const result = network.activate(normalizedInput);
    console.log(`Predicted milk yield: ${Math.round(result[0] * 30)} litres`);
  });
});
/* exports.createAnimalProjection = catchAsync(async () => {
  const animal = await Animal.findById('628c8e193108dae81ddad038');

  if (!animal) return;

  const network = new Architect.Perceptron(3, 8, 1);

  // Create a trainer
  const trainer = new Trainer(network);

  // Example training data
  const trainingSet = [
    { input: [ 2, 1, 0 ], output: [ 12.3 ] },
    { input: [ 2, 1, 1 ], output: [ 22.5 ] },
    { input: [ 2, 1, 2 ], output: [ 25.0 ] },
    { input: [ 2, 1, 3 ], output: [ 24.7 ] },
    { input: [ 2, 1, 4 ], output: [ 23.9 ] },
    { input: [ 2, 1, 5 ], output: [ 21.6 ] },
    { input: [ 2, 1, 6 ], output: [ 18.4 ] },
    { input: [ 2, 1, 7 ], output: [ 15.2 ] },
    { input: [ 2, 1, 8 ], output: [ 12.8 ] },
    { input: [ 2, 1, 9 ], output: [ 10.4 ] },
    { input: [ 2, 1, 10 ], output: [ 8.1 ] },
    { input: [ 3, 2, 0 ], output: [ 14.0 ] },
    { input: [ 3, 2, 1 ], output: [ 24.5 ] },
    { input: [ 3, 2, 2 ], output: [ 27.3 ] },
    { input: [ 3, 2, 3 ], output: [ 26.9 ] },
    { input: [ 3, 2, 4 ], output: [ 25.4 ] },
    { input: [ 3, 2, 5 ], output: [ 23.2 ] },
  ];

  // Train the network
  trainer.train(trainingSet, {
    rate: 0.1,               // Learning rate
    iterations: 20000,       // Total training iterations
    error: 0.005,            // Target error threshold
    log: 100,                // Log every 100 iterations
    cost: Trainer.cost.MSE,  // Use Mean Squared Error as the cost function
    schedule: {
      every: 100,
      do: function (data) {
        console.log(`Iteration: ${data.iterations}, Error: ${data.error}`);
      },
    },
  });

  console.log(network.activate([ 3, 2, 6 ]) * 30)
}); */


