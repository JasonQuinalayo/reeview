import axios from 'axios';
import { config } from '../utils';

const url = `${config.backendUrl}/api/user`;

const getCurrentUser = async () => {
  const user = await axios.get(url);
  return user.data;
};

const getAdmins = async () => {
  const admins = await axios.get(`${url}/admins`);
  return admins.data;
};

const getAllUsers = async () => {
  const users = await axios.get(`${url}/all`);
  return users.data;
};

const promote = async (id) => {
  const user = await axios.post(`${url}/promote/${id}`);
  return user.data;
};

export default {
  getCurrentUser, getAdmins, getAllUsers, promote,
};
