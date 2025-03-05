const AccRecord = require('../models/accRecordModel');
const Farm = require('../models/farmModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const moment = require('moment');

exports.createRecord = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id;
  req.body.farm = req.user.farm;
  const record = await AccRecord.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      record
    }
  });
});

exports.editRecord = catchAsync(async (req, res, next) => {
  const record = await AccRecord.findByIdAndUpdate(req.params.recordId, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

exports.deleteRecord = catchAsync(async (req, res, next) => {
  const record = await AccRecord.findByIdAndDelete(req.params.recordId);

  res.status(200).json({
    status: 'success'
  });
});

exports.salaryTracker = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: { $ne: 'owner' } });

  users.forEach(async user => {
    if (user.salaryType === 'float' || !user.salary) return;

    if (!user.salaryDueNextDate || new Date() > new Date(user.salaryDueNextDate)) {
      const nextSalary = new Date(user.salaryDueDay === 1 ? moment().add(1, 'month').startOf('month') : moment().add(1, 'month').endOf('month'));

      const record = await AccRecord.create({
        farm: user.farm,
        user: user._id,
        type: 'expense',
        category: 'Заработная плата',
        amount: user.salary,
        date: new Date()
      });

      if (record) {
        user.salaryDueNextDate = nextSalary;
        await user.save();
      }
    }
  });
});

exports.addAccCategory = catchAsync(async (req, res, next) => {
  const farm = await Farm.findByIdAndUpdate(req.user.farm, { $push: { accCategories: req.body } });

  res.status(201).json({
    status: 'success',
    data: {
      farm
    }
  });
});

exports.getRecords = catchAsync(async (req, res, next) => {
  const records = await AccRecord.find({ farm: req.user.farm }).populate('user');

  res.status(200).json({
    status: 'success',
    data: {
      records
    }
  });
});