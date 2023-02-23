import Router from 'express';
import { createInterview, deleteInterview, getAllInterviews, getInterview, updateInterview } from './service.js';
export const interviewRouter = Router();

interviewRouter.get('/', async (req, res, next) => {
  try {
    const response = await getAllInterviews();
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

interviewRouter.post('/', async (req, res, next) => {
  try {
    const response = await createInterview(req.body);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

interviewRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await deleteInterview(id);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

interviewRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await updateInterview(req.body, id);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

interviewRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await getInterview(id);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});
