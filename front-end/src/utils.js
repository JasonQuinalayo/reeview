import { setQuestions } from './state';

export const config = {
  backendUrl: process.env.NODE_ENV === 'production'
    ? 'https://reeview.onrender.com'
    : 'http://localhost:3000',
};

export const objectValuesToArray = (questions) => Object.keys(questions).map((q) => questions[q]);

export const approvedQuestionsAsArray = (questions) => (
  objectValuesToArray(questions.ee)
    .concat(objectValuesToArray(questions.esas)).concat(objectValuesToArray(questions.math))
);

export const fetchQuestions = async (dispatch, questionsService) => {
  const questions = await questionsService.getQuestions();
  const approvedCategorizedQuestions = { ee: {}, esas: {}, math: {} };
  const pendingQuestions = [];
  questions.forEach((question) => {
    if (question.approved) {
      approvedCategorizedQuestions[question.category][question.id] = question;
    } else {
      pendingQuestions.push(question);
    }
  });
  dispatch(setQuestions({ approved: approvedCategorizedQuestions, pending: pendingQuestions }));
};

export const isAlphaNumeric = (str) => /^[A-Za-z0-9]+$/.test(str);

export const isAlphaNumericWithSpace = (str) => /^[A-Za-z0-9 ]+$/.test(str);

export const isAscii = (str) => {
  for (let i = 0; i < str.length; i++) if (str.charCodeAt(i) > 127) return false;
  return true;
};
