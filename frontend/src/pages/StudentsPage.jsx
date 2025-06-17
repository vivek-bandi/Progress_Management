import { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import assets from "../assets/download.png";
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  downloadStudent,
} from "../services/studentService";

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

  useEffect(() => {
    loadStudents();
  }, []);

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
      <StudentTable
        students={students}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
