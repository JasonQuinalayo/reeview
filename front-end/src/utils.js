import { setQuestions } from './state';

export const config = {
  backendUrl: 'http://localhost:3000/api',
};

export const questionObjectToArray = (questions) => {
  const results = [];
  Object.keys(questions).forEach((q) => results.push(questions[q]));
  return results;
};

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

export const isAscii = (str) => {
  for (let i = 0; i < str.length; i++) if (str.charCodeAt(i) > 127) return false;
  return true;
};
