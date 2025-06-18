import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;
const CronAPI = import.meta.env.VITE_CRON_URL;
export const getAllStudents = () => axios.get(API);
export const addStudent = (student) => axios.post(API, student);
export const updateStudent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API}/${id}`);
export const downloadStudent = () =>
  axios.get(`${API}/export/csv`, {
    responseType: "blob",
  });

export const getStudentProfile = (id) => axios.get(`${API}/${id}/profile`);
export const getStudentContestHistory = (id, days) =>
  axios.get(`${API}/profile/${id}/contests?days=${days}`);
