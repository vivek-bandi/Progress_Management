import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getStudentProfile,
  getStudentContestHistory,
  updateStudent,
} from "../services/StudentService";
import RatingGraph from "../components/RatingGraph";
import BarChart from "../components/BarChart";
import HeatMap from "../components/HeatMap";

export default function ProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminderLoading, setReminderLoading] = useState(false);

  const [contestDays, setContestDays] = useState(30);
  const [contestHistory, setContestHistory] = useState([]);

  const [problemDays, setProblemDays] = useState(7);
  const [problemStats, setProblemStats] = useState([]);
  const [problemFiltered, setProblemFiltered] = useState([]);

  const dateCountMap = {};
  problemFiltered.forEach((p) => {
    const date = new Date(p.solvedDate).toISOString().slice(0, 10);
    dateCountMap[date] = (dateCountMap[date] || 0) + 1;
  });
  const heatmapData = Object.entries(dateCountMap).map(([date, count]) => ({
    date,
    count,
  }));

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getStudentProfile(id);
        setStudent(res.data);
        setProblemStats(res.data.problemStats || []);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchContestData() {
      try {
        const res = await getStudentContestHistory(id, contestDays);
        const sorted = res.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setContestHistory(sorted);
      } catch (err) {
        console.error("Failed to fetch contest history", err);
      }
    }
    if (student) {
      fetchContestData();
    }
  }, [id, contestDays, student]);

  useEffect(() => {
    if (problemStats.length > 0) {
      const filtered = problemStats.filter((p) => {
        const daysAgo = Date.now() - new Date(p.solvedDate).getTime();
        return daysAgo <= problemDays * 24 * 60 * 60 * 1000;
      });
      setProblemFiltered(filtered);
    }
  }, [problemDays, problemStats]);

  const handleToggleReminder = async () => {
    setReminderLoading(true);
    try {
      await updateStudent(student.studentId._id, {
        emailReminderDisable: !student.studentId.emailReminderDisable,
      });
      setStudent({
        ...student,
        studentId: {
          ...student.studentId,
          emailReminderDisable: !student.studentId.emailReminderDisable,
        },
      });
    } catch (err) {
      alert("Failed to update reminder setting");
    }
    setReminderLoading(false);
  };

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (!student)
    return <p className="text-center text-red-500">Profile not found.</p>;

  const mostDifficult = problemFiltered.reduce(
    (max, p) => (!max || p.rating > max.rating ? p : max),
    null
  );
  const totalSolved = problemFiltered.length;
  const avgRating =
    totalSolved > 0
      ? (
          problemFiltered.reduce((sum, p) => sum + p.rating, 0) / totalSolved
        ).toFixed(1)
      : 0;
  const avgPerDay = Math.round(totalSolved / problemDays);

  // Rating buckets for bar chart
  const buckets = [
    { label: "0-799", min: 0, max: 799, count: 0 },
    { label: "800-1199", min: 800, max: 1199, count: 0 },
    { label: "1200-1599", min: 1200, max: 1599, count: 0 },
    { label: "1600-1999", min: 1600, max: 1999, count: 0 },
    { label: "2000+", min: 2000, max: Infinity, count: 0 },
  ];
  problemFiltered.forEach((p) => {
    const b = buckets.find((b) => p.rating >= b.min && p.rating <= b.max);
    if (b) b.count++;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-sky-700 mb-4">
        {student.studentId.name}'s Profile
      </h1>

      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow mb-6">
        <p>
          <strong className="text-sky-700">Email:</strong>{" "}
          {student.studentId.email}
        </p>
        <p>
          <strong className="text-sky-700">Phone:</strong>{" "}
          {student.studentId.phone}
        </p>
        <p>
          <strong className="text-sky-700">CF Handle:</strong>{" "}
          {student.studentId.cfHandle}
        </p>
        <p>
          <strong className="text-sky-700">Current Rating:</strong>{" "}
          {student.studentId.currentRating}
        </p>
        <p>
          <strong className="text-sky-700">Max Rating:</strong>{" "}
          {student.studentId.maxRating}
        </p>
        <p>
          <strong className="text-sky-700">Last Sync:</strong>{" "}
          {new Date(student.lastSync).toLocaleString()}
        </p>
        <p>
          <strong className="text-sky-700">Reminder Emails Sent:</strong>{" "}
          {student.studentId.emailCount ?? 0}
        </p>
        <p>
          <strong className="text-sky-700">Automatic Reminder Email:</strong>{" "}
          <span className="inline-flex items-center">
            <span
              onClick={reminderLoading ? undefined : handleToggleReminder}
              className={`relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in ${
                reminderLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              style={{ verticalAlign: "middle" }}
              role="checkbox"
              aria-checked={!student.studentId.emailReminderDisable}
              tabIndex={0}
            >
              <input
                type="checkbox"
                checked={!student.studentId.emailReminderDisable}
                onChange={handleToggleReminder}
                disabled={reminderLoading}
                className="hidden"
              />
              <span
                className={`block w-10 h-6 rounded-full transition-colors ${
                  student.studentId.emailReminderDisable
                    ? "bg-gray-300"
                    : "bg-sky-500"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                  student.studentId.emailReminderDisable
                    ? "translate-x-0"
                    : "translate-x-4"
                }`}
              ></span>
            </span>
            <span>
              {student.studentId.emailReminderDisable ? "Disabled" : "Enabled"}
            </span>
          </span>
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-sky-700">
            Contest History
          </h2>
          <select
            value={contestDays}
            onChange={(e) => setContestDays(Number(e.target.value))}
            className="border rounded p-1 bg-sky-50"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
        </div>

        <div style={{ height: 300 }}>
          {contestHistory.length > 0 ? (
            <RatingGraph data={contestHistory} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-sky-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Contest</th>
                <th className="p-2 border">Rating Change</th>
                <th className="p-2 border">Rank</th>
                <th className="p-2 border">Unsolved Problems</th>
              </tr>
            </thead>
            <tbody>
              {contestHistory.map((contest, index) => (
                <tr key={index} className="hover:bg-sky-50">
                  <td className="p-2 border">
                    {new Date(contest.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{contest.contestName}</td>
                  <td
                    className={`p-2 border ${
                      contest.ratingChange > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {contest.ratingChange > 0 ? "+" : ""}
                    {contest.ratingChange}
                  </td>
                  <td className="p-2 border">{contest.rank}</td>
                  <td className="p-2 border">{contest.problemsUnsolved}</td>
                </tr>
              ))}
              {contestHistory.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-2 text-center text-gray-400">
                    No contest data found for selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Problem Solving Data Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-sky-700">
            Problem Solving Data
          </h2>
          <select
            value={problemDays}
            onChange={(e) => setProblemDays(Number(e.target.value))}
            className="border rounded p-1 bg-sky-50"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        <p>
          <strong className="text-sky-700">Most difficult problem:</strong>{" "}
          {mostDifficult
            ? `${mostDifficult.problemId} (${mostDifficult.rating})`
            : "N/A"}
        </p>
        <p>
          <strong className="text-sky-700">Total problems solved:</strong>{" "}
          {totalSolved}
        </p>
        <p>
          <strong className="text-sky-700">Average rating:</strong> {avgRating}
        </p>
        <p>
          <strong className="text-sky-700">Average problems/day:</strong>{" "}
          {avgPerDay}
        </p>

        <div className="mt-4">
          <h3 className="font-semibold text-sky-600 mb-2">
            Rating Distribution
          </h3>
          <BarChart data={buckets} />
        </div>
      </div>

      <div className="mt-8">
        <HeatMap
          data={heatmapData}
          startDate={new Date(Date.now() - problemDays * 24 * 60 * 60 * 1000)}
          endDate={new Date()}
        />
      </div>
    </div>
  );
}
