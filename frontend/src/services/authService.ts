import axios from 'axios';

const checkAuth = async () => {
  try {
    // TODO: UPDATE the path of the api or create it
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth`);
    return response.data.isAuthenticated;
  } catch (error) {
    return false;
  }
};

export default checkAuth;
