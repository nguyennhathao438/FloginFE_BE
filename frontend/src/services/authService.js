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
/**
 * Gọi API đăng ký người dùng
 * @param {{ username: string, password: string, confirmPassword: string }} data 
 * @returns {Promise<Object>}
 */
export const register = async (data) => {
  const { username, password, confirmPassword } = data;

  if (!username || !password || !confirmPassword) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  try {
    const res = await axios.post(`${API_URL}/register`, data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || "Đăng ký thất bại";
    throw new Error(message);
  }
};
