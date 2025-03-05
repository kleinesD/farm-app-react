const Feed = require('../models/feedModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

exports.addRecord = catchAsync(async (req, res, next) => {
  req.body.farm = req.user.farm;
  if (req.body.autoRefill || req.body.autoWriteOff) {
    req.body.nextAutoAction = new Date(new Date(req.body.date).getTime() + req.body.autoTimeSpan * 24 * 60 * 60 * 1000);
  }

  const record = await Feed.create(req.body);


  res.status(201).json({
    status: 'success',
    data: {
      record
    }
  });
});

exports.getOneRecord = catchAsync(async (req, res, next) => {
  const record = await Feed.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

exports.getFeedRecords = catchAsync(async (req, res, next) => {
  const records = await Feed.find({ feed: req.params.feedId });

  res.status(200).json({
    status: 'success',
    data: {
      records
    }
  });
});

exports.editRecord = catchAsync(async (req, res, next) => {
  if (req.body.autoRefill || req.body.autoWriteOff) {
    req.body.nextAutoAction = new Date(new Date(req.body.date).getTime() + req.body.autoTimeSpan * 24 * 60 * 60 * 1000);
  }
  const record = await Feed.findByIdAndUpdate(req.params.id, req.body);

  record.editedAtBy.push({
    date: new Date(),
    user: req.user._id
  });

  await record.save();

  res.status(200).json({
    status: 'success',
    data: {
      record
    }
  });
});

exports.deleteRecord = catchAsync(async (req, res, next) => {
  const record = await Feed.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
  });
});

exports.autoAction = catchAsync(async (req, res, next) => {
  const records = await Feed.find({ type: 'record', autoAction: true, autoActionStop: { $ne: true }, /* nextAutoAction: { $lt: Date.now() } */ }).populate('feed');

  records.forEach(async record => {
    const relRecords = await Feed.find({ feed: record.feed._id });

    let total = 0;
    relRecords.forEach(relRecord => {
      if (relRecord.status === 'increase') {
        total += relRecord.amount;
      } else {
        total -= relRecord.amount;
      }
    });

    if (total < 1) return;


    const newRecord = await Feed.create({
      type: record.type,
      status: record.status,
      amount: record.amount <= total ? record.amount : total,
      unit: record.unit,
      ingredients: record.ingredients,
      autoAction: false,
      date: record.nextAutoAction,
      feed: record.feed,
      farm: record.farm,
      firstAction: record._id
    });

    if (newRecord) {
      record.nextAutoAction = new Date(moment(record.nextAutoAction).add(record.autoTimeSpan, record.autoTimeSpanUnit));
      record.save();
    }
  });

});

exports.getCostOfFeed = catchAsync(async (req, res, next) => {
  const feeds = await Feed.find({ type: 'sample', costPerUnit: { $exists: true }, farm: req.user.farm });
  const records = await Feed.find({ type: 'record', date: { $gte: new Date(moment().subtract(1, 'year').startOf('day')) }, date: { $lte: new Date(moment().endOf('day')) } });

  let yearTotal = 0;
  let byFeed = [];
  feeds.forEach(async feed => {
    let feedTotal = 0;
    records.forEach(record => {
      if (record.feed.toString() !== feed._id.toString()) return;
      yearTotal = yearTotal + (record.amount * feed.costPerUnit);
      feedTotal = feedTotal + (record.amount * feed.costPerUnit);
    });
    byFeed.push({feed: feed.name, feedYearTotal: feedTotal, feedMonthTotal: feedTotal / 12, feedDayTotal: feedTotal / 365});
  });

  byFeed.sort((a, b) => b.feedYearTotal - a.feedYearTotal);
  
  res.status(200).json({
    status: 'success',
    data: {
      feeds,
      yearTotal,
      byFeed
    }
  });
});

exports.getFarmFeedRecords = catchAsync(async (req, res, next) => {
  const records = await Feed.find({ type: 'record', farm: req.user.farm }).sort('date');

  res.status(200).json({
    status: 'success',
    data: {
      records
    }
  })
});