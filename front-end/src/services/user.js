import axios from 'axios';
import { config } from '../utils';

const getCurrentUser = async () => {
  const user = await axios.get(`${config.backendUrl}/user`);
  return user.data;
};

export default { getCurrentUser };
