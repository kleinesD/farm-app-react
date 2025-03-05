const catchAsync = require('../utils/catchAsync');
const VetResearch = require('../models/vetResearchModel');

exports.createVetResearch = catchAsync(async(req, res, next) => {
  req.body.user = req.user;
  req.body.farm = req.user.farm;
  const vetResearch = await VetResearch.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      vetResearch
    }
  });
});
exports.updateVetResearch = catchAsync(async(req, res, next) => {
  const vetResearch = await VetResearch.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      vetResearch
    }
  });
});
exports.deleteVetResearch = catchAsync(async(req, res, next) => {
  const vetResearch = await VetResearch.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success'
  });
});

exports.getOneVetResearch = catchAsync(async(req, res, next) => {
  const vetResearch = await VetResearch.findById(req.params.id).populate('animal');

  res.status(200).json({
    status: 'success',
    data: {
      vetResearch
    }
  });
});
exports.getAnimalVetResearch = catchAsync(async(req, res, next) => {
  const vetResearches = await VetResearch.find({animal: req.params.animalId}).sort('-date');

  res.status(200).json({
    status: 'success',
    data: {
      vetResearches
    }
  });
});