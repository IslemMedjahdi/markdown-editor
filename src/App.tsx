import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// screens
import MarkDownEditor from "./screens/MarkDownEditor";
import Profile from "./screens/Profile";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Error from "./screens/Error";
import Settings from "./screens/Settings";

export default function App() {
  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<MarkDownEditor />} />
        <Route path="/home" element={<MarkDownEditor />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="settings" element={<Settings />} />
        <Route path="markdown/:markdownId" element={<MarkDownEditor />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </AnimatePresence>
  );
}
