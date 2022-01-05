const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ createdBy: userId, _id: jobId });
  if (!job) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Job not found' });
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  try {
    const { company, position, status, createdBy } = req.body;
    const newJob = await Job.create({
      company,
      position,
      status,
      createdBy,
    });
    res.status(StatusCodes.OK).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  const {
    body: { company, position, status },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company || !position || !status) {
    throw new BadRequestError('Missing required fields');
  }

  try {
    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw new NotFoundError('Job not found');
    }
    return res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  try {
    const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
    if (!job) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Job not found' });
    }

    return res.status(StatusCodes.OK).json({ msg: 'Job deleted' });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
