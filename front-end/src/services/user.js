import axios from 'axios';
import { config } from '../util';

const getUser = async () => {
  const user = await axios.get(`${config.backendUrl}/user`);
  return user.data;
};

export default { getUser };
