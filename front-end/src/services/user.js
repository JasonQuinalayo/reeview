import axios from 'axios';
import { config } from '../utils';

const getCurrentUser = async () => {
  const user = await axios.get(`${config.backendUrl}/user`);
  return user.data;
};

const getAdmins = async () => {
  const admins = await axios.get(`${config.backendUrl}/user/admins`);
  return admins.data;
};

const getAllUsers = async () => {
  const users = await axios.get(`${config.backendUrl}/user/all`);
  return users.data;
};

const promote = async (id) => {
  const user = await axios.post(`${config.backendUrl}/user/promote/${id}`);
  return user.data;
};

export default {
  getCurrentUser, getAdmins, getAllUsers, promote,
};
