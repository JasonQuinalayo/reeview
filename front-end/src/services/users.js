import axios from 'axios';
import { config } from '../util';

const getCurrentUser = async () => {
  const user = await axios.get(`${config.backendUrl}/current-user`);
  return user.data;
};

export default { getCurrentUser };
