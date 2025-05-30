const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const isDev = require('electron-is-dev');

exports.signup = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    accessBlocks: req.body.accessBlocks,
    farm: req.body.farm
  });

  createSignToken(newUser, 201, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  let cookieOptions = {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: "/",
  }

  res.cookie('jwt', 'logged out', cookieOptions)

  res.status(200).json({
    status: 'success',
    message: 'User logged out'
  });
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try {
    let token;
    if (req.cookies) {
      token = req.cookies.jwt
    }

    if (!token) return next();

    const decoded = await promisify(jwt.verify)(token, 'it-is-what-it-is-and-you-cant-do-nothing-about-it');

    const user = await User.findById(decoded.id);

    if (!user || user.changedPasswordAfter(decoded.iat)) return next();

    res.locals.user = user;
    req.user = user

  } catch (err) {
    return next();
  }
  next();
});

exports.restrict = (block, other = false, data = false) => catchAsync(async (req, res, next) => {
  const user = req.user;

  /* Restrict by block */
  if (!user.accessBlocks.includes(block)) return next(new AppError('Unauthorized access! This user is not allowed to use this block.', 401));

  /* Restrict by edit other's data */
  if (other && !user.editOther) return next(new AppError('Unauthorized access! This user cannot edit data of other users.', 401));

  /* Restrict by add data */
  if (data && !user.editData) return next(new AppError('Unauthorized access! This user cannot add data.', 401));

  next();
});

exports.restrictRoles = (roles) => (req, res, next) => {
  if (!req.user.role.includes(...roles)) return next(new AppError('Unauthorized access!', 401));
  next();
}

exports.restrictBlocks = (block) => (req, res, next) => {
  if (!req.user.accessBlocks.includes(block)) return next(new AppError('Unauthorized access!', 401));
  next();
}

exports.createUserLink = catchAsync(async (req, res, next) => {
  let newUserSettings = {
    role: req.body.role,
    restrictions: req.body.restrictions,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    farm: req.user.farm,
    editOther: req.body.editOther
  }

  const token = jwt.sign(newUserSettings, 'it-really-fucking-annoys-me', { expiresIn: '7d' })
  //const decoded = await promisify(jwt.verify)(token, 'it-really-fucking-annoys-me');
  let link = `${req.protocol}://${req.get('host')}/create-user-link/${token}`
  res.status(200).json({
    status: 'success',
    data: {
      token,
      link
    }
  });
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* TO KEEP */
const signToken = id => {
  let token = jwt.sign({ id }, 'it-is-what-it-is-and-you-cant-do-nothing-about-it', { expiresIn: '365d' });
  return token;
}

const createSignToken = async (user, status, req, res) => {
  if (res.headersSent) return;
  
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: "/",
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  return res.status(status).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !await user.comparePasswords(user.password, req.body.password)) return next(new AppError('Incorrect email or password!', 400));

  createSignToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 403));
  }

  const decoded = await promisify(jwt.verify)(token, 'it-is-what-it-is-and-you-cant-do-nothing-about-it');

  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError('This user does not exist', 404));

  if (user.changedPasswordAfter(decoded.iat)) return next(new AppError('User changed password. Please log in again.', 403));

  req.user = user;
  next();
});

exports.checkAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new AppError('You are not logged in!', 403));
  }
  
  const decoded = await promisify(jwt.verify)(token, 'it-is-what-it-is-and-you-cant-do-nothing-about-it');
  
  const user = await User.findById(decoded.id);
  
  if (!user) return next(new AppError('This user does not exist', 404));

  if (user.changedPasswordAfter(decoded.iat)) return next(new AppError('User changed password. Please log in again.', 403));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
