import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:room" element={<Home />} />
    </Routes>
  );
}
