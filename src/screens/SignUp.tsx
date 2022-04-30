import background from "../assets/backgroundLogin.png";
import { Link, useNavigate } from "react-router-dom";
import { SignUpData } from "../types";
import { useEffect, useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth, db } from "../core/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
export default function SignUp() {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, , loading, authError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, ,] = useUpdateProfile(auth);
  const [data, setData] = useState<SignUpData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string>("");
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError("");
    if (data.password !== data.confirmPassword || !data.password) {
      setError("Password mismatch");
      return;
    }
    if (
      !/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/.test(
        data.firstName.toLowerCase()
      )
    ) {
      setError("Invalid first name");
      return;
    }
    if (
      !/^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/.test(
        data.lastName.toLowerCase()
      )
    ) {
      setError("Invalid last name");
      return;
    }
    createUserWithEmailAndPassword(data.email, data.password).then(() =>
      updateProfile({ displayName: `${data.firstName} ${data.lastName}` })
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setDoc(doc(db, "users", currentUser?.uid), {}).then(() =>
          navigate("/Home", { replace: true })
        );
      }
    });
    return unsubscribe;
  }, [navigate]);

  return (
    <div className="grid h-screen bg-zinc-800 lg:grid-cols-2">
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
          className="flex w-5/6 flex-col items-center space-y-5 lg:w-4/6 "
          onSubmit={submitHandler}
        >
          <div className="flex w-full items-center space-x-3">
            <input
              placeholder="firstName"
              className="w-full rounded-sm py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
              name="firstName"
              value={data.firstName}
              onChange={changeHandler}
            />
            <input
              placeholder="lastName"
              className="w-full rounded-sm py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
              name="lastName"
              value={data.lastName}
              onChange={changeHandler}
            />
          </div>
          <input
            placeholder="email"
            className="w-full rounded-sm py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
            name="email"
            type={"email"}
            value={data.email}
            onChange={changeHandler}
          />
          <input
            placeholder="password"
            name="password"
            className="w-full rounded-sm  py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
            type={"password"}
            value={data.password}
            onChange={changeHandler}
          />
          <div className="flex w-full  flex-col space-y-1">
            <input
              placeholder="confirm Password"
              name="confirmPassword"
              className="w-full rounded-sm  py-3 px-5 font-mono font-semibold text-zinc-900 outline-0 placeholder:font-normal"
              type={"password"}
              value={data.confirmPassword}
              onChange={changeHandler}
            />
            {error && (
              <p className="font-RMono text-sm text-red-500">{error}</p>
            )}
            {!error && authError && (
              <p className="font-RMono text-sm text-red-500">
                {authError.code}
              </p>
            )}
            {loading && (
              <p className="font-RMono text-sm text-red-500">loading ...</p>
            )}
          </div>
          <button className="rounded-sm bg-zinc-800 py-3 px-5 font-RMono text-white transition-all duration-200 hover:bg-opacity-70">
            Sign Up
          </button>
          <Link
            className="text-center font-RMono text-white hover:underline"
            to={"/login"}
          >
            already have an account ?
          </Link>
        </form>
      </div>
      <div
        className="hidden h-full bg-cover lg:block"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
    </div>
  );
}
