import axios from "axios";

const API_URL = "http://localhost:3700/api/users";

/**
 * Gọi API đăng nhập người dùng
 * @param {{ username: string, password: string }} data 
 * @returns {Promise<Object>} 
 */
export const login = async (data) => {
  if (!data.username && !data.password) {
    throw new Error("Username và password không được để trống");
  }
  if (!data.username) {
    throw new Error("Username không được để trống");
  }
  if (!data.password) {
    throw new Error("Password không được để trống");
  }

  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data; 
  } catch (error) {
    
    const message = error.response?.data?.message || "Lỗi đăng nhập";
    throw new Error(message);
  }
};
