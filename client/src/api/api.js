import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  return await api.post("/users/register", userData);
};

export const loginUser = async (userData) => {
  return await api.post("/users/login", userData);
};

export const getUserProfile = async () => {
  return await api.get("/users/profile");
};

export const updateUserEmail = async (userId, newEmail) => {
  return await api.patch(`/users/email/${userId}`, { newEmail });
};

export const updateUserPassword = async (
  userId,
  { oldPassword, newPassword }
) => {
  return await api.patch(`/users/password/${userId}`, {
    oldPassword,
    newPassword,
  });
};

export const deleteUser = async (userId) => {
  return await api.delete(`/users/${userId}`);
};

export const createTask = async (taskData) => {
  return await api.post("/tasks", taskData);
};

export const getAllTasks = async () => {
  return await api.get("/tasks");
};

export const getTaskById = async (taskId) => {
  return await api.get(`/tasks/${taskId}`);
};

export const updateTaskById = async (taskId, taskData) => {
  return await api.put(`/tasks/${taskId}`, taskData);
};

export const deleteTaskById = async (taskId) => {
  return await api.delete(`/tasks/${taskId}`);
};

export const getTasksByUser = async (userId) => {
  return await api.get(`/tasks/user/${userId}`);
};

export const test = async (method, data) => {
  return await api.post("/test", { method, data });
};
