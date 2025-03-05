const Vet = require('../models/vetModel');
const VetResearch = require('../models/vetResearchModel');
const Inventory = require('../models/inventoryModel');
const Scheme = require('../models/schemeModel');
const Animal = require('../models/animalModel');
const Calendar = require('../models/calendarModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.changeAnimalHealthStatus = async (animalId) => {
  const animal = await Animal.findById(animalId);

  let animalDiseases = await Vet.find({ animal: animal._id, category: 'problem' });

  let sick = false;
  animalDiseases.forEach((dis) => {
    if (dis.cured === false) {
      sick = true;
    }
  });

  if (sick) {
    animal.healthStatus = 'sick';
  } else {
    animal.healthStatus = 'healthy';
  }

  await animal.save();
};

exports.createVetAction = catchAsync(async (req, res, next) => {
  req.body.animal = req.params.animalId;
  req.body.user = req.user._id;
  req.body.category = 'action';
  req.body.farm = req.user.farm;


  const action = await Vet.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      action
    }
  })
});

exports.editVetAction = catchAsync(async (req, res, next) => {
  const action = await Vet.findByIdAndUpdate(req.params.actionId, req.body);

  action.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await action.save();

  res.status(201).json({
    status: 'success',
    data: {
      action
    }
  })
});

exports.deleteVetAction = catchAsync(async (req, res, next) => {
  const action = await Vet.findByIdAndDelete(req.params.actionId);

  res.status(203).json({
    status: 'success',
  })
});

exports.createVetProblem = catchAsync(async (req, res, next) => {
  req.body.animal = req.params.animalId;
  req.body.user = req.user._id;
  req.body.category = 'problem';
  req.body.cured = false;
  req.body.farm = req.user.farm;

  const problem = await Vet.create(req.body);

  this.changeAnimalHealthStatus(problem.animal);

  res.status(201).json({
    status: 'success',
    data: {
      problem
    }
  })
});

exports.editVetProblem = catchAsync(async (req, res, next) => {
  const problem = await Vet.findByIdAndUpdate(req.params.problemId, req.body);

  problem.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await problem.save();

  res.status(201).json({
    status: 'success',
    data: {
      problem
    }
  })
});

exports.deleteVetProblem = catchAsync(async (req, res, next) => {
  const problem = await Vet.findByIdAndDelete(req.params.problemId);

  res.status(203).json({
    status: 'success'
  })
});

exports.createVetScheduledAction = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.scheduled = true;
  req.body.farm = req.user.farm;
  const action = await Vet.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      action
    }
  })
});

exports.addTreatment = catchAsync(async (req, res, next) => {
  req.body.disease = req.params.diseaseId;
  req.body.user = req.user._id;
  req.body.farm = req.user.farm;
  req.body.category = 'treatment';

  const treatment = await Vet.create(req.body);
  const disease = await Vet.findById(treatment.disease)

  if (req.body.cured) {
    disease.cured = true;
    await disease.save();
  }

  this.changeAnimalHealthStatus(disease.animal);


  res.status(201).json({
    status: 'success',
    data: {
      treatment
    }
  })
});

exports.editVetTreatment = catchAsync(async (req, res, next) => {
  const treatment = await Vet.findByIdAndUpdate(req.params.treatmentId, req.body);

  treatment.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await treatment.save();

  res.status(201).json({
    status: 'success',
    data: {
      treatment
    }
  })
});

exports.deleteVetTreatment = catchAsync(async (req, res, next) => {
  const treatment = await Vet.findByIdAndUpdate(req.params.treatmentId);

  res.status(203).json({
    status: 'success'
  })
});

exports.createScheme = catchAsync(async (req, res, next) => {
  req.body.farm = req.user.farm;
  req.body.user = req.user._id;
  const scheme = await Scheme.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      scheme
    }
  });
});

exports.useScheme = catchAsync(async (req, res, next) => {
  let scheduledSchemeActions = []
  const scheme = await Scheme.findById(req.body.schemeId);
  let body = {
    medication: scheme.points[0].medication,
    quantity: scheme.points[0].quantity,
    schemeStarter: true,
    scheme: scheme._id,
    category: 'scheme',
    user: req.user._id,
    animal: req.params.animalId,
    farm: req.user.farm,
    date: req.body.date,
    finished: false
  }
  const firstAction = await Vet.create(body);
  const firstActionMedUse = await Inventory.create({
    type: 'record',
    recordType: 'decrease',
    medication: firstAction.medication,
    quantity: firstAction.quantity,
    module: 'vet',
    inventoryType: 'medication',
    date: firstAction.date,
    farm: firstAction.farm,
    user: firstAction.user,
    medicationRel: firstAction._id
  });

  let prevPointDate = firstAction.date;

  scheme.points.forEach(async (point, index, array) => {
    if (!point.firstPoint && !point.insemination) {
      let date;
      let timeInHours = point.timeUnit === 'h' ? point.scheduledIn : point.scheduledIn * 24;
      if (point.countFrom === 'last-point') {
        date = new Date(prevPointDate.getTime() + timeInHours * 60 * 60 * 1000);
      } else {
        date = new Date(firstAction.date.getTime() + timeInHours * 60 * 60 * 1000);
      }

      prevPointDate = date;

      let vetAction = {
        firstSchemeAction: firstAction._id,
        scheduled: true,
        medication: point.medication,
        quantity: point.quantity,
        category: 'scheme',
        scheme: scheme._id,
        date,
        user: req.user._id,
        animal: req.params.animalId
      }

      let schemeAction = await Vet.create(vetAction);
      scheduledSchemeActions.push(schemeAction);
    } else if (!point.firstPoint && point.insemination) {
      let date;
      let timeInHours = point.timeUnit === 'h' ? point.scheduledIn : point.scheduledIn * 24;
      if (point.countFrom === 'last-point') {
        date = new Date(prevPointDate.getTime() + timeInHours * 60 * 60 * 1000);
      } else {
        date = new Date(firstAction.date.getTime() + timeInHours * 60 * 60 * 1000);
      }

      prevPointDate = date;

      let vetAction = {
        firstSchemeAction: firstAction._id,
        scheduled: true,
        category: 'scheme',
        scheme: scheme._id,
        date,
        user: req.user._id,
        animal: req.params.animalId,
        schemeInsemination: true
      }

      let schemeAction = await Vet.create(vetAction);
      scheduledSchemeActions.push(schemeAction);
    }

  });

  res.status(201).json({
    status: 'success',
    data: {
      firstAction,
      scheduledSchemeActions
    }
  });
});

exports.deleteScheme = catchAsync(async (req, res, next) => {
  const scheme = await Scheme.findByIdAndDelete(req.params.schemeId);

  res.status(200).json({
    status: 'success'
  });
});

exports.deleteStartedScheme = catchAsync(async (req, res, next) => {
  let firstSchemeAction = await Vet.findByIdAndDelete(req.params.firstSchemeAction);
  let prevPoints = await Vet.find({ firstSchemeAction: req.params.firstSchemeAction });
  prevPoints.forEach(async point => {
    await Inventory.deleteOne({ medicationRel: point._id });
  });
  await Vet.deleteMany({ firstSchemeAction: req.params.firstSchemeAction });

  res.status(203).json({
    status: 'success'
  });
});

exports.editStartedScheme = catchAsync(async (req, res, next) => {
  let scheduledSchemeActions = []
  let prevPoints = await Vet.find({ firstSchemeAction: req.params.firstSchemeAction });
  prevPoints.forEach(async point => {
    await Inventory.deleteOne({ medicationRel: point._id });
  });
  await Vet.deleteMany({ firstSchemeAction: req.params.firstSchemeAction });

  const scheme = await Scheme.findById(req.body.schemeId);

  let firstAction = await Vet.findById(req.params.firstSchemeAction);
  firstAction.medication = scheme.points[0].medication;
  firstAction.quantity = scheme.points[0].quantity;
  firstAction.scheme = scheme._id;
  firstAction.date = new Date(req.body.date);
  firstAction.finished = false;

  await firstAction.save();

  await Inventory.deleteOne({ medicationRel: firstAction._id });
  const firstActionMedUse = await Inventory.create({
    type: 'record',
    recordType: 'decrease',
    medication: firstAction.medication,
    quantity: firstAction.quantity,
    module: 'vet',
    inventoryType: 'medication',
    date: firstAction.date,
    farm: firstAction.farm,
    user: firstAction.user,
    medicationRel: firstAction._id
  });

  let prevPointDate = firstAction.date;

  scheme.points.forEach(async (point, index, array) => {
    if (!point.firstPoint && !point.insemination) {
      let date;
      let timeInHours = point.timeUnit === 'h' ? point.scheduledIn : point.scheduledIn * 24;
      if (point.countFrom === 'last-point') {
        date = new Date(prevPointDate.getTime() + timeInHours * 60 * 60 * 1000);
      } else {
        date = new Date(firstAction.date.getTime() + timeInHours * 60 * 60 * 1000);
      }

      prevPointDate = date;

      let vetAction = {
        firstSchemeAction: firstAction._id,
        scheduled: true,
        medication: point.medication,
        quantity: point.quantity,
        category: 'scheme',
        scheme: scheme._id,
        date,
        user: req.user._id,
        animal: req.params.animalId
      }

      let schemeAction = await Vet.create(vetAction);
      scheduledSchemeActions.push(schemeAction);
    } else if (!point.firstPoint && point.insemination) {
      let date;
      let timeInHours = point.timeUnit === 'h' ? point.scheduledIn : point.scheduledIn * 24;
      if (point.countFrom === 'last-point') {
        date = new Date(prevPointDate.getTime() + timeInHours * 60 * 60 * 1000);
      } else {
        date = new Date(firstAction.date.getTime() + timeInHours * 60 * 60 * 1000);
      }

      prevPointDate = date;

      let vetAction = {
        firstSchemeAction: firstAction._id,
        scheduled: true,
        category: 'scheme',
        scheme: scheme._id,
        date,
        user: req.user._id,
        animal: req.params.animalId,
        schemeInsemination: true
      }

      let schemeAction = await Vet.create(vetAction);
      scheduledSchemeActions.push(schemeAction);
    }

  });

  res.status(201).json({
    status: 'success',
    data: {
      firstAction,
      scheduledSchemeActions
    }
  });
});

exports.editScheme = catchAsync(async (req, res, next) => {
  const scheme = await Scheme.findById(req.params.schemeId);

  scheme.points = [];

  scheme.name = req.body.name;
  scheme.points = req.body.points;

  scheme.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await scheme.save();

  res.status(200).json({
    status: 'success',
    data: {
      scheme
    }
  });
});

exports.getStartedScheme = catchAsync(async (req, res, next) => {
  let scheme = await Vet.findById(req.params.schemeId).populate({ path: 'otherPoints', populate: { path: 'medication' } }).populate('animal').populate('medication').populate('scheme');

  res.status(200).json({
    status: 'success',
    data: {
      scheme
    }
  });
});

exports.getVetRecord = catchAsync(async (req, res, next) => {
  let record = await Vet.findById(req.params.id).populate('animal').populate('treatments').populate({ path: 'disease', populate: { path: 'animal' } }).populate({ path: 'medications', populate: { path: 'medication' } }).populate({ path: 'otherPoints', populate: { path: 'medication' } }).populate('scheme');

  let relatedRecords = [];
  if (record && record.subId) relatedRecords = await Vet.find({ subId: record.subId, _id: { $ne: record._id } }).populate('animal').populate('treatments').populate({ path: 'disease', populate: { path: 'animal' } }).populate({ path: 'medications', populate: { path: 'medication' } });;

  res.status(200).json({
    status: 'success',
    data: {
      record,
      relatedRecords
    }
  });
});

exports.schemeAutoUpdate = catchAsync(async (req, res, next) => {
  const schemes = await Vet.find({ schemeStarter: true, finished: { $ne: true } }).populate('otherPoints').populate('animal').populate('scheme');

  schemes.forEach(async (scheme) => {
    /* Write-off medication */
    scheme.otherPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

    scheme.otherPoints.forEach(async point => {
      let existingMed = await Inventory.find({ medicationRel: point._id })
      if (existingMed.length > 0) return;

      if (!point.schemeInsemination) {
        const medUse = await Inventory.create({
          type: 'record',
          recordType: 'decrease',
          medication: point.medication,
          quantity: point.quantity,
          module: 'vet',
          inventoryType: 'medication',
          date: point.date,
          farm: point.farm,
          user: point.user,
          medicationRel: point._id
        });
      } else if (point.schemeInsemination) {
        if (new Date() < new Date(point.date)) return;

        scheme.finished = true;
        await scheme.save();
      }
    });


  });
});

exports.addVetRecord = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.farm = req.user.farm;

  const record = await Vet.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      record
    }
  })
});

exports.editVetRecord = catchAsync(async (req, res, next) => {
  const record = await Vet.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  })
});

exports.getVetData = catchAsync(async (req, res, next) => {
  const problems = await Vet.find({ category: 'problem', cured: { $ne: true }, farm: req.user.farm }).populate('animal');
  const actions = await Vet.find({ category: 'action', farm: req.user.farm }).populate('animal');
  const treatments = await Vet.find({ category: 'treatment', farm: req.user.farm }).populate('animal').populate({ path: 'disease', populate: { path: 'animal' } });
  const currentSchemes = await Vet.find({ category: 'scheme', schemeStarter: true, schemeResult: 'undefined', farm: req.user.farm }).populate('medication').populate({ path: 'otherPoints', populate: { path: 'medication' } }).populate('animal').populate('scheme');
  const schemes = await Vet.find({ category: 'scheme', schemeStarter: true, farm: req.user.farm }).populate('medication').populate({ path: 'otherPoints', populate: { path: 'medication' } }).populate('animal').populate('scheme');
  const researches = await VetResearch.find({ farm: req.user.farm }).populate('animal');
  const examinations = await Vet.find({ category: 'examination', farm: req.user.farm }).populate('animal')

  res.status(200).json({
    status: 'success',
    data: {
      problems,
      actions,
      treatments,
      currentSchemes,
      researches,
      examinations,
      schemes
    }
  })
});



