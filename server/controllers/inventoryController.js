const Inventory = require('../models/inventoryModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addInventory = catchAsync(async(req, res, next) => {
  req.body.farm = req.user.farm;
  const inventory = await Inventory.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      inventory
    }
  });
});

exports.editInventory = catchAsync(async (req, res, next) => {
  const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body);

  inventory.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await inventory.save();

  res.status(200).json({
    status: 'success',
    data: {
      inventory
    }
  });
});

exports.deleteInventory = catchAsync(async(req, res, next) => {
  const inventory = await Inventory.findByIdAndDelete(req.params.id);

  res.status(203).json({
    status: 'success'
  });
});

exports.getMedicationInventory = catchAsync(async(req, res, next) => {
  const records = await Inventory.find({type: 'record', medication: req.params.medicationId}).populate('medication').populate('medicationRel');

  let medication = {id: req.params.medicationId, records, inventory : 0};
  records.forEach(record => {
    if(record.recordType === 'increase') medication.inventory += record.quantity;
    if(record.recordType === 'decrease') medication.inventory -= record.quantity;
  });

  res.status(200).json({
    status: 'success',
    data: {
      medication
    }
  });
});

exports.deleteRelatedMedication = catchAsync(async(req, res, next) => {
  const medications = await Inventory.deleteMany({type: 'record', medicationRel: req.params.id});

  res.status(203).json({
    status: 'success'
  });
});

exports.getAllMedicationInventory = catchAsync(async(req, res, next) => {
  const medications = await Inventory.find({type: 'sample', farm: req.user.farm});
  const records = await Inventory.find({type: 'record', farm: req.user.farm});
  let meds = []

  medications.forEach(med => {
    let unit = 'мг.';
    if(med.medicationUnit === 'ml') unit = 'мл.';
    if(med.medicationUnit === 'g') unit = 'г.';

    let medication = {name: med.name, records: [], unit, inventory : 0};
    
    records.forEach(record => {
      if(record.medication.toString() !== med._id.toString()) return;
      
      if(record.recordType === 'increase') medication.inventory += record.quantity;
      if(record.recordType === 'decrease') medication.inventory -= record.quantity;
      medication.records.push(record);
    });

    meds.push(medication);
  })


  res.status(200).json({
    status: 'success',
    data: {
      meds
    }
  });
});

exports.getAllMedicationRecords = catchAsync(async(req, res, next) => {
  const records = await Inventory.find({type: 'record', farm: req.user.farm}).populate('medication');

  res.status(200).json({
    status: 'success',
    data: {
      records
    }
  }); 
});