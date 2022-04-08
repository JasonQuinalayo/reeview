import axios from 'axios';
import { config } from '../utils';

const url = `${config.backendUrl}/api/auth`;

const login = async (username, password) => {
  const user = await axios.post(`${url}/login`, { username, password });
  return user.data;
};

const logout = async () => axios.post(`${url}/logout`);

export default { login, logout };
