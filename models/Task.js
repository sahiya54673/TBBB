const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
    reminderTime: {
      type: Date,
      default: null,
    },
    isVoiceTask: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

// Index for faster queries by user
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
