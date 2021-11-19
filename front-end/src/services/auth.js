import axios from 'axios';
import { config } from '../utils';

const login = async (username, password) => {
  const user = await axios.post(`${config.backendUrl}/auth/login`, { username, password });
  return user.data;
};

const logout = async () => axios.post(`${config.backendUrl}/auth/logout`);

export default { login, logout };
