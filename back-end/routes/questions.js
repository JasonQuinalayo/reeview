const questionsRouter = require('express').Router();
const { checkSchema, validationResult } = require('express-validator');
const Question = require('../mongo/models/question');
const { ApiValidationError, AuthorizationError, RequestError } = require('../utils/errors');

questionsRouter.get('/', async (_, res) => {
  res.send(await Question.find().populate('submitted.by', 'name').populate('approved.by', 'name'));
});

const newQuestionSchema = {
  question: {
    in: ['body'],
    isLength: {
      options: { max: 500 },
      errorMessage: 'Question too long',
    },
  },
  choices: {
    in: ['body'],
    custom: {
      options: (value) => {
        const validChoice = (c) => (typeof c === 'string' || c instanceof String) && c.length < 200;
        const choicesSchema = {
          a: validChoice, b: validChoice, c: validChoice, d: validChoice,
        };
        const valid = typeof value === 'object' && Object.keys(choicesSchema).reduce((acc, cur) => (
          acc && value[cur] && choicesSchema[cur](value[cur])
        ), true);
        if (!valid) {
          throw new Error('Invalid choices');
        }
        return true;
      },
    },
  },
  category: {
    in: ['body'],
    isIn: {
      options: [['ee', 'esas', 'math']],
      errorMessage: 'Invalid category(must be ee, math or esas)',
    },
  },
  answer: {
    in: ['body'],
    isIn: {
      options: [['a', 'b', 'c', 'd']],
      errorMessage: 'Invalid answer(must be a, b, c, or d)',
    },
  },
  tags: {
    in: ['body'],
    custom: {
      options: (value) => {
        const valid = value === null || value === undefined
          || (Array.isArray(value) && value.reduce((acc, cur) => acc
          && (typeof cur === 'string' || cur instanceof String) && cur.length < 100, true));
        if (!valid) {
          throw new Error('Invalid tags');
        }
        return true;
      },
    },
  },
  year: {
    in: ['body'],
    custom: {
      options: (value) => {
        const valid = value === null || value === undefined
          || (Number.isInteger(value) && value <= (new Date()).getFullYear());
        if (!valid) {
          throw new Error('Invalid year');
        }
        return true;
      },
    },
  },
  imgSrc: {
    in: ['body'],
    custom: {
      options: (value) => {
        const valid = value === undefined || value === null || ((typeof value === 'string'
            || value instanceof String) && value.length < 100);
        if (!valid) {
          throw new Error('Invalid image source');
        }
        return true;
      },
    },
  },
};

questionsRouter.post('/',
  checkSchema(newQuestionSchema),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiValidationError(errors.array(), 'Invalid request body properties');
    const {
      question, choices, category, tags, answer, year, imgSrc,
    } = req.body;
    const newQuestion = new Question({
      question,
      choices,
      category,
      tags,
      answer,
      submitted: {
        by: req.session.user.id,
        date: (new Date()).toLocaleDateString('en', { timeZone: 'Asia/Singapore' }),
      },
      year,
      imgSrc,
      suggestedUpdates: [],
    });
    await newQuestion.save({ validateBeforeSave: true });
    res.status(201).send(newQuestion);
  });

questionsRouter.post('/approve/:id', async (req, res) => {
  if (!req.session.user.isAdmin) throw new AuthorizationError('Approving questions requires admin privileges');
  const pendingQuestion = await Question.findById(req.params.id);
  if (!pendingQuestion) res.status(404).end();
  else {
    const approved = {
      by: req.session.user.id,
      date: (new Date()).toLocaleDateString('en', { timeZone: 'Asia/Singapore' }),
    };
    await pendingQuestion.updateOne({ approved });
    if (pendingQuestion.updateTo) {
      const oldQuestion = await Question.findById(pendingQuestion.updateTo);
      if (oldQuestion) await oldQuestion.delete();
    }
    res.status(201).send({ ...pendingQuestion.toJSON(), approved });
  }
});

questionsRouter.post('/suggest-update/:id',
  async (req, res, next) => {
    const question = await Question.findById(req.params.id);
    if (!question || !question.approved) throw new RequestError('Cannot suggest update to non-existent/unapproved questions');
    req.question = question;
    next();
  },
  checkSchema(newQuestionSchema),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiValidationError(errors.array(), 'Invalid request body properties');
    const {
      question, choices, category, tags, answer, year, imgSrc,
    } = req.body;
    const newQuestion = new Question({
      question,
      choices,
      category,
      tags,
      answer,
      submitted: {
        by: req.session.user.id,
        date: (new Date()).toLocaleDateString('en', { timeZone: 'Asia/Singapore' }),
      },
      year,
      imgSrc,
      updateTo: req.params.id,
    });
    await newQuestion.save({ validateBeforeSave: true });
    await req.question.updateOne(
      { suggestedUpdates: req.question.suggestedUpdates.concat(newQuestion._id.toString()) },
    );
    res.status(201).send(newQuestion);
  });

questionsRouter.delete('/:id', async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) res.status(404).end();
  else if (req.session.user.isAdmin) {
    await question.delete();
    res.status(204).end();
  } else if (question.approved) {
    throw new AuthorizationError('Deleting approved questions require admin privileges');
  } else if (question.submitted.by.toString() === req.session.user.id) {
    await question.delete();
    res.status(204).end();
  } else {
    throw new AuthorizationError('Deleting pending questions require the deleter to be the submitter or an admin');
  }
});

module.exports = questionsRouter;
