import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
// screens
import MarkDownEditor from "./screens/MarkDownEditor";
import Profile from "./screens/Profile";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Error from "./screens/Error";
import Settings from "./screens/Settings";

export default function App() {
  return (
    <>
      <Helmet>
        <title>Markdown Online Editor</title>
        <meta
          name="description"
          content="MarkDown Editor is a web Application that allows you to write and edit your markdowns with live preview. You can use the website without authentication and you can also login/register with your email and password. Authentication allows you to save and preview your markdowns from your profile. The website provides you with the settings to update your profile, also more features is on the website!"
        />
        <meta
          name="keywords"
          content="markdown, markdown online, markdown react, markdown profile,markdown editor, markdown firebase, edit markdown, markdown github"
        />
      </Helmet>
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
    </>
  );
}
