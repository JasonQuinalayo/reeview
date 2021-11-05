import axios from 'axios';
import { config } from '../utils';

const login = async (username, password) => {
  const user = await axios.post(`${config.backendUrl}/login`, { username, password });
  return user.data;
};

export default { login };
