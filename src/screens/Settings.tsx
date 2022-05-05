import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import background from "../assets/backgroundLogin.png";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUpdatePassword, useUpdateProfile } from "react-firebase-hooks/auth";
import { auth } from "../core/firebaseConfig";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

type dataType = {
  displayName: string;
  password: string;
};

export default function Settings() {
  const [updateProfile, updatingProfile, errorProfile] = useUpdateProfile(auth);
  const [updatePassword, updatingPassword, errorPassword] =
    useUpdatePassword(auth);
  const navigate = useNavigate();
  const [data, setData] = useState<dataType>({
    displayName: "",
    password: "",
  });
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setData({
          displayName: currentUser.displayName || "",
          password: "",
        });
      } else {
        navigate("/Home", { replace: true });
      }
    });
  }, [navigate]);
  return (
    <div className="min-h-screen bg-zinc-900">
      <Helmet>
        <title>Settings | Markdown Online Editor</title>
      </Helmet>
      <Header />
      <div className="grid lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ backgroundImage: `url(${background})` }}
          className="flex min-h-[92vh] flex-col items-center justify-center space-y-10 bg-cover lg:!bg-none"
        >
          <div>
            <h1 className="font-RMono text-3xl font-medium tracking-widest text-white">
              Settings
            </h1>
          </div>
          <div className="w-full max-w-sm space-y-5 p-10 md:w-auto md:max-w-none">
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <input
                name="displayName"
                placeholder="display Name"
                className="rounded-sm py-2 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
                value={data.displayName}
                onChange={changeHandler}
              />
              <button
                onClick={async () =>
                  data.displayName &&
                  (await updateProfile({ displayName: data.displayName }))
                }
                className="bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600 md:w-1/2"
              >
                {updatingProfile ? "loading ..." : "change the display name"}
              </button>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <input
                name="password"
                type={"password"}
                placeholder="new password"
                className="rounded-sm py-2 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
                value={data.password}
                onChange={changeHandler}
              />
              <button
                onClick={async () => await updatePassword(data.password)}
                className="bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600 md:w-1/2"
              >
                {updatingPassword ? "loading ..." : "change the password"}
              </button>
            </div>
            {errorPassword && (
              <p className="font-RMono text-sm text-red-500">
                {errorPassword.message}
              </p>
            )}
            {errorProfile && (
              <p className="font-RMono text-sm text-red-500">
                {errorProfile.message}
              </p>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{
            duration: 0.4,
            x: { type: "spring", stiffness: 50 },
          }}
          className="hidden min-h-[92vh] bg-cover lg:block"
          style={{ backgroundImage: `url(${background})` }}
        ></motion.div>
      </div>
    </div>
  );
}
