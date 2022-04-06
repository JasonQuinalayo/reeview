import axios from 'axios';
import { config } from '../utils';

const getQuestions = async () => {
  const user = await axios.get(`${config.backendUrl}/questions`);
  return user.data;
};

const addNewQuestion = async (body) => {
  const question = await axios.post(`${config.backendUrl}/questions`, body);
  return question.data;
};

const suggestUpdateQuestion = async (body, id) => {
  const question = await axios.post(`${config.backendUrl}/questions/suggest-update/${id}`, body);
  return question.data;
};

const approvePendingQuestion = async (id) => {
  const question = await axios.post(`${config.backendUrl}/questions/approve/${id}`);
  return question.data;
};

export default {
  getQuestions, addNewQuestion, approvePendingQuestion, suggestUpdateQuestion,
};
