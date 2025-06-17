import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentsPage from "./pages/StudentsPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentsPage />} />
        <Route path="/student/:id" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
