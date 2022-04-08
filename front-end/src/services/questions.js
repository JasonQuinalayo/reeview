import axios from 'axios';
import { config } from '../utils';

const url = `${config.backendUrl}/api/questions`;

const getQuestions = async () => {
  const user = await axios.get(url);
  return user.data;
};

const addNewQuestion = async (body) => {
  const question = await axios.post(url, body);
  return question.data;
};

const suggestUpdateQuestion = async (body, id) => {
  const question = await axios.post(`${url}/suggest-update/${id}`, body);
  return question.data;
};

const approvePendingQuestion = async (id) => {
  const question = await axios.post(`${url}/approve/${id}`);
  return question.data;
};

export default {
  getQuestions, addNewQuestion, approvePendingQuestion, suggestUpdateQuestion,
};
