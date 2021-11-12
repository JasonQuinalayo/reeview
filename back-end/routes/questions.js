const questionsRouter = require('express').Router();
const Question = require('../mongo/models/question');

questionsRouter.get('/', async (_, res) => {
  res.send(await Question.find({}).populate('submittedBy', 'name').populate('approvedBy', 'name'));
});

questionsRouter.post('/', async (req, res) => {
  const newQuestion = new Question({
    question: req.question,
    choices: req.choices,
    maximumLengthChoice: req.maximumLengthChoice,
    category: req.category,
    tags: req.tags,
    answer: req.answer,
    submittedBy: req.submittedBy,
    year: req.year,
    imgSrc: req.imgSrc,
  });
  await newQuestion.save({ validateBeforeSave: true });
  res.send(newQuestion);
});

questionsRouter.post('/approve-question/:id', async (req, res) => {
  if (!req.session.user.isAdmin) throw new Error('unauthorized');
  const pendingQuestion = await Question.findById(req.params.id);
  if (!pendingQuestion) res.status(404).end();
  else {
    await pendingQuestion.update({
      approved: {
        by: req.session.user.id,
        on: (new Date()).toLocaleDateString('en', { timeZone: 'Asia/Singapore' }),
      },
    });
    res.send(pendingQuestion);
  }
});

questionsRouter.delete('/:id', async (req, res) => {
  if (!req.session.user.isAdmin) throw new Error('unauthorized');
  await Question.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = questionsRouter;
