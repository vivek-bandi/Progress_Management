import { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import assets from "../assets/download.png";
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  downloadStudent,
} from "../services/StudentService";
import { getCronTime, updateCronTime } from "../services/CronService";
export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load students");
    }
  };

  const [cronTime, setCronTime] = useState("");
  const [editingCron, setEditingCron] = useState(false);
  const [newCronTime, setNewCronTime] = useState("");

  useEffect(() => {
    loadStudents();
    const fetchCronTime = async () => {
      try {
        const res = await getCronTime();
        setCronTime(res.data.cronTime);
      } catch (err) {
        console.error(err);
        alert("Failed to load cron time");
      }
    };
    fetchCronTime();
  }, []);

  const handleCronEdit = () => {
    setNewCronTime(cronTime);
    setEditingCron(true);
  };

  const handleCronSave = async () => {
    try {
      await updateCronTime(newCronTime);
      setCronTime(newCronTime);
      setEditingCron(false);
      alert("Cron time updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update cron time");
    }
  };

  const handleCronCancel = () => {
    setEditingCron(false);
    setNewCronTime("");
  };

  const handleDownload = async () => {
    try {
      const response = await downloadStudent();
      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to download CSV");
    }
  };
  const handleAdd = async (student) => {
    try {
      await addStudent(student);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  const handleEdit = async (student) => {
    try {
      await updateStudent(student._id, student);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  function cronToTime(cron) {
    if (!cron) return "";
    const [min, hour] = cron.split(" ");
    let h = parseInt(hour, 10);
    const m = min.padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-sky-800">
          Student Progress Management
        </h1>
        <img
          src={assets}
          alt="Download CSV"
          className="w-8 h-8 cursor-pointer hover:opacity-75"
          onClick={handleDownload}
        />
      </div>
      <div className="mb-6 flex items-center gap-4">
        <span className="font-semibold text-gray-700">Cron Time:</span>
        {editingCron ? (
          <>
            <input
              type="text"
              value={newCronTime}
              onChange={(e) => setNewCronTime(e.target.value)}
              className="border px-2 py-1 rounded mr-2"
            />
            <button
              onClick={handleCronSave}
              className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={handleCronCancel}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="text-blue-700">{cronToTime(cronTime)}</span>
            <button
              onClick={handleCronEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </>
        )}
      </div>
      <StudentTable
        students={students}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
