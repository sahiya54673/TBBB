const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add an employee name'],
      trim: true,
      maxlength: [80, 'Name cannot be more than 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please add a role/position'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'on-leave', 'inactive'],
      default: 'active',
    },
    avatar: {
      type: String,
      default: '',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

employeeSchema.index({ owner: 1, department: 1 });
employeeSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
