import axios from "axios";

const CronAPI = import.meta.env.VITE_CRON_URL;

export const getCronTime = () => axios.get(`${CronAPI}/current-time`);
export const updateCronTime = (cronTime) =>
  axios.post(`${CronAPI}/update-time`, { cronTime });
