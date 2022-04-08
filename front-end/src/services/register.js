import axios from 'axios';
import { config } from '../utils';

const url = `${config.backendUrl}/api/register`;

const register = async (username, name, password, link) => {
  const user = await axios.post(`${url}/${link}`, { username, name, password });
  return user.data;
};

const createLink = async () => {
  const link = await axios.post(`${url}/add-link`);
  return link.data;
};

export default { register, createLink };
