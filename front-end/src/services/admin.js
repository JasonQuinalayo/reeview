import axios from 'axios';
import { config } from '../utils';

const getAdmins = async () => {
  const admins = await axios.get(`${config.backendUrl}/admin`);
  return admins.data;
};

const getAllUsers = async () => {
  const users = await axios.get(`${config.backendUrl}/admin/users`);
  return users.data;
};

const promote = async (id) => {
  const user = await axios.post(`${config.backendUrl}/admin/promote/${id}`);
  return user.data;
};

export default { getAdmins, getAllUsers, promote };
