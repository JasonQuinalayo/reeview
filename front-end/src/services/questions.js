import axios from 'axios';
import { config } from '../util';

const getQuestions = async () => {
  const user = await axios.get(`${config.backendUrl}/questions`);
  return user.data;
};

export default { getQuestions };
