const questionsRouter = require('express').Router();
const Question = require('../mongo/models/question');

questionsRouter.get('/', async (_, res) => {
  res.send(await Question.find({}).populate('submittedBy', 'name').populate('approvedBy', 'name'));
});

questionsRouter.post('/', async (req, res) => {
  const newQuestion = new Question(req.body);
  await newQuestion.save();
  res.send(newQuestion);
});

module.exports = questionsRouter;
