import axios from 'axios';
import { config } from '../utils';

const getQuestions = async () => {
  const user = await axios.get(`${config.backendUrl}/questions`);
  return user.data;
};

export default { getQuestions };
