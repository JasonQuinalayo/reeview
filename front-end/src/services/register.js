import axios from 'axios';
import { config } from '../utils';

const register = async (username, name, password, link) => {
  const user = await axios.post(`${config.backendUrl}/register/${link}`, { username, name, password });
  return user.data;
};

const createLink = async () => {
  const link = await axios.post(`${config.backendUrl}/register/add-link`);
  return link.data;
};

export default { register, createLink };
