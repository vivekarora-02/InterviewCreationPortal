import { InterviewModel } from '../../database/schema/interview.schema.js';
import Joi from 'joi';
import { HttpError } from '../../common/error.js';
export const getAllInterviews = async () => {
  return await InterviewModel.find({ isDeleted: false }).lean().exec();
};

export const deleteInterview = async id => {
  return await InterviewModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
    .lean()
    .exec();
};

export const getInterview = async id => {
  return await InterviewModel.findOne({ _id: id }).lean().exec();
};

export const createInterview = async requestBody => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    startDate: Joi.date().required().greater('now'),
    endDate: Joi.date().required().greater(Joi.ref('startDate')),
    interviewers: Joi.array().items(Joi.string().email().required()).min(1).required().unique(),
    interviewees: Joi.array().items(Joi.string().email().required()).min(1).required().unique(),
    type: Joi.string().required(),
  });
  const { error, value } = schema.validate(requestBody);

  if (error) {
    throw new HttpError(error.message, 400);
  }

  await validateInterviewCreationOrUpdation(value.startDate, value.endDate, value.interviewers, value.interviewees);

  return InterviewModel.create(value);
};

export const updateInterview = async (requestBody, id) => {
  const schema = Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date().greater('now'),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    interviewers: Joi.array().items(Joi.string().email().required()).min(1).unique(),
    interviewees: Joi.array().items(Joi.string().email().required()).min(1).unique(),
    type: Joi.string(),
    isCompleted: Joi.boolean(),
  });
  const { error, value } = schema.validate(requestBody);

  if (error) {
    throw new HttpError(error.message, 400);
  }

  await validateInterviewCreationOrUpdation(value.startDate, value.endDate, value.interviewers, value.interviewees, [
    id,
  ]);

  return InterviewModel.findOneAndUpdate({ _id: id }, { $set: { ...value } }, { new: true });
};

const validateInterviewCreationOrUpdation = async (
  startDate,
  endDate,
  interviewers,
  interviewees,
  excludeInterviewsIds = [],
) => {
  const isIntervieweesAvailable = await InterviewModel.countDocuments({
    _id: { $nin: excludeInterviewsIds },
    interviewees: { $in: interviewees },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
    isDeleted: false,
    isCompleted: false,
  });

  if (isIntervieweesAvailable) {
    throw new HttpError(`${isIntervieweesAvailable} of the interviewee(s) not available at the given slots`, 400);
  }

  const isInterviewersAvailable = await InterviewModel.countDocuments({
    _id: { $nin: excludeInterviewsIds },
    interviewers: { $in: interviewers },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
    isDeleted: false,
    isCompleted: false,
  });

  if (isInterviewersAvailable) {
    throw new HttpError(`${isInterviewersAvailable} of the interviewer(s) not available at the given slots`, 400);
  }
  return true;
};
