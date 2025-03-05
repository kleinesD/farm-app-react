const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    default: 'user-default.png'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date
  },
  role: {
    type: String,
    required: true
  },
  accessBlocks: {
    type: [String],
    required: true,
    enum: ['herd', 'vet', 'warehouse', 'hr', 'distribution', 'feed']
  },
  editOther: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Boolean,
    default: false
  },
  salaryType: {
    type: String,
    enum: ['fixed', 'float']
  },
  salary: Number,
  salaryDueDay: Number,
  salaryDueNextDate: Date, 
  password: {
    type: String
  },
  passwordConfirm: {
    type: String,
    validator: {
      validate: function (val) {
        return val === this.password;
      }
    },
    message: 'Passwords do not match.'
  },
  farm: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farm'
  },
  resetPasswordToken: String,
  resetPasswordTimer: Date,
  creationDate: {
    type: Date,
    default: Date.now()
  },
  pendingUserLinks: [String],
  editedAtBy: [
    {
      date: Date,
      message: String,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }

    }
  ],
});

userSchema.pre(/^find/, function (next) {
  this.populate('farm');

  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.comparePasswords = async function (userPass, candidatePass) {
  return await bcrypt.compare(candidatePass, userPass)
}

userSchema.methods.changedPasswordAfter = function (date) {
  if (this.passwordChangedAt) {
    const timeStamp = this.passwordChangedAt.getTime() / 1000;

    return timeStamp > date;
  } else {
    return false;
  }
}

const User = mongoose.model('User', userSchema);
module.exports = User;