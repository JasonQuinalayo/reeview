import axios from 'axios';
import { config } from '../utils';

const getCurrentUser = async () => {
  const user = await axios.get(`${config.backendUrl}/user`);
  return user.data;
};

const logout = async () => axios.post(`${config.backendUrl}/user/logout`);

export default { getCurrentUser, logout };
