const { Schema, model } = require('mongoose');
const { NotFoundError } = require('../errors');

const jobsSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, 'Company is required'],
      maxLength: [50, 'Company name is too long'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      maxLength: [50, 'Position name is too long'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['applied', 'interviewing', 'hired', 'rejected'],
      default: 'applied',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  { timestamps: true }
);

module.exports = model('Job', jobsSchema);
