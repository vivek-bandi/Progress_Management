import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentTable({ students, onAdd, onEdit, onDelete }) {
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    cfHandle: "",
    currentRating: 0,
    maxRating: 0,
  });

  const [editMap, setEditMap] = useState({});
  const navigate = useNavigate();

  const handleChange = (id, field, value) => {
    setEditMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = (id) => {
    const { currentRating, maxRating, ...dataToUpdate } = editMap[id];
    onEdit({ ...dataToUpdate, _id: id });
    setEditMap((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const isEditing = (id) => !!editMap[id];

  const canAdd =
    newStudent.name.trim() &&
    newStudent.email.trim() &&
    newStudent.phone.trim() &&
    newStudent.cfHandle.trim();

  return (
    <div className="overflow-x-auto shadow rounded bg-white">
      <table className="min-w-full table-fixed text-sm">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="p-2 w-1/6 text-left align-middle">Name</th>
            <th className="p-2 w-1/6 text-left align-middle">Email</th>
            <th className="p-2 w-1/6 text-left align-middle">Phone</th>
            <th className="p-2 w-1/6 text-left align-middle">CF Handle</th>
            <th className="p-2 w-1/12 text-left align-middle">
              Current Rating
            </th>
            <th className="p-2 w-1/12 text-left align-middle">Max Rating</th>
            <th className="p-2 w-1/6 text-left align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-t hover:bg-gray-50">
              {["name", "email", "phone", "cfHandle"].map((field) => (
                <td className="p-2 align-middle" key={field}>
                  {isEditing(s._id) ? (
                    <input
                      className="border p-1 rounded w-full focus:ring focus:ring-blue-200"
                      value={editMap[s._id][field]}
                      onChange={(e) =>
                        handleChange(s._id, field, e.target.value)
                      }
                    />
                  ) : (
                    s[field]
                  )}
                </td>
              ))}
              <td className="p-2 align-middle">{s.currentRating}</td>
              <td className="p-2 align-middle">{s.maxRating}</td>
              <td className="p-2 align-middle space-x-1">
                {isEditing(s._id) ? (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    onClick={() => handleSave(s._id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => setEditMap({ ...editMap, [s._id]: s })}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => onDelete(s._id)}
                >
                  Delete
                </button>
                <button
                  className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  onClick={() => navigate(`/student/${s._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-t bg-gray-50">
            {["name", "email", "phone", "cfHandle"].map((field) => (
              <td className="p-2 align-middle" key={field}>
                <input
                  className="border p-1 rounded w-full focus:ring focus:ring-blue-200"
                  value={newStudent[field]}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      [field]: e.target.value,
                    })
                  }
                />
              </td>
            ))}
            <td className="p-2 align-middle">0</td>
            <td className="p-2 align-middle">0</td>
            <td className="p-2 align-middle">
              <button
                className={`${
                  canAdd
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white px-2 py-1 rounded`}
                disabled={!canAdd}
                onClick={() => {
                  onAdd({
                    ...newStudent,
                    name: newStudent.name.trim(),
                    email: newStudent.email.trim(),
                    phone: newStudent.phone.trim(),
                    cfHandle: newStudent.cfHandle.trim(),
                  });
                  setNewStudent({
                    name: "",
                    email: "",
                    phone: "",
                    cfHandle: "",
                    currentRating: 0,
                    maxRating: 0,
                  });
                }}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
