import React, { useEffect, useState } from "react";
import { loginData } from "../types";
import background from "../assets/backgroundLogin.png";
import { auth } from "../core/firebaseConfig";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState<loginData>({ email: "", password: "" });
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);
  let navigate = useNavigate();
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    signInWithEmailAndPassword(data.email, data.password);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) navigate("/Home", { replace: true });
    });
    return unsubscribe;
  }, [navigate]);
  return (
    <div className="grid h-screen bg-zinc-800 lg:grid-cols-2">
      <div
        className="hidden h-full bg-cover lg:block"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div
        className="flex h-full flex-col items-center justify-center space-y-10 bg-zinc-900 bg-cover lg:!bg-none"
        style={{ backgroundImage: `url(${background})` }}
      >
        <Link
          to={"/home"}
          className="font-RMono text-3xl font-medium tracking-widest text-white"
        >
          MARKDOWN
        </Link>
        <form
          className="flex w-4/6 flex-col items-center space-y-5 lg:w-1/2 "
          onSubmit={submitHandler}
        >
          <input
            placeholder="email"
            className="w-full rounded-sm py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
            name="email"
            type={"email"}
            value={data.email}
            onChange={changeHandler}
          />
          <div className="flex w-full  flex-col space-y-1">
            <input
              placeholder="password"
              name="password"
              className="w-full rounded-sm  py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
              type={"password"}
              value={data.password}
              onChange={changeHandler}
            />
            {error && (
              <p className="font-RMono text-sm text-red-500">{error.code}</p>
            )}
            {loading && (
              <p className="font-RMono text-sm text-red-500">loading ...</p>
            )}
          </div>
          <button className="rounded-sm bg-zinc-800 py-3 px-5 font-RMono text-white transition-all duration-200 hover:bg-opacity-70">
            Login
          </button>
          <Link
            className="text-center font-RMono text-white hover:underline"
            to={"/sign-up"}
          >
            I Don't Have an Account Yet
          </Link>
        </form>
      </div>
    </div>
  );
}
