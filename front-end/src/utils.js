import { setQuestions } from './state';
import { questionsService } from './services';

const backendUrl = 'http://localhost:3000/api';

const questionObjectToArray = (questions) => {
  const results = [];
  Object.keys(questions).forEach((q) => results.push(questions[q]));
  return results;
};

const fetchQuestions = async (dispatch) => {
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

export default { backendUrl, questionObjectToArray, fetchQuestions };
