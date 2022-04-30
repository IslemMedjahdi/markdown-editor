import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import MarkDown from "../components/MarkDown";
import Preview from "../components/Preview";
import { db, auth } from "../core/firebaseConfig";

export default function MarkDownEditor() {
  let params = useParams();
  let location = useLocation();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [markDown, setMarkDown] = useState<any>("");
  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (
      location.pathname.toLowerCase() === "/home" ||
      location.pathname.toLowerCase() === "/"
    ) {
      localStorage.setItem("markdown", e.target.value);
    }
    setMarkDown(e.target.value);
  };
  const getMarkDown = useCallback(
    async (uid: string, markdownId: string) => {
      setLoading(true);
      const docRef = doc(db, "users", uid, "markdowns", markdownId);
      const docSnap = await getDoc(docRef);
      setLoading(false);
      if (docSnap.exists()) {
        setMarkDown(docSnap.data().markDown);
      } else {
        navigate("/profile", { replace: true });
      }
    },
    [navigate]
  );
  const updateMarkDown = async (uid: string, markDownId: string) => {
    setLoading(true);
    const docRef = doc(db, "users", uid, "markdowns", markDownId);
    await updateDoc(docRef, {
      markDown: markDown,
      lastUpdate: Timestamp.now(),
    });
    setLoading(false);
    navigate("/profile");
  };
  const createMarkDown = async (uid: string) => {
    setLoading(true);
    await addDoc(collection(db, "users", uid, "markdowns"), {
      title: "untitled document",
      lastUpdate: Timestamp.now(),
      markDown: markDown,
    });
    setLoading(false);
    localStorage.clear();
    navigate("/profile", { replace: true });
  };
  useEffect(() => {
    if (
      location.pathname.toLowerCase() !== "/home" &&
      location.pathname.toLowerCase() !== "/"
    ) {
      if (params.markdownId) {
        onAuthStateChanged(auth, (currentUser) => {
          if (currentUser && params.markdownId) {
            getMarkDown(currentUser.uid, params.markdownId);
          } else {
            navigate("/login", { replace: true });
          }
        });
      }
    } else {
      let markdown = localStorage.getItem("markdown");
      if (markdown) {
        setMarkDown(markdown);
      }
    }
  }, [location.pathname, navigate, params.markdownId, getMarkDown]);
  const clickHandler = () => {
    if (
      location.pathname.toLowerCase() !== "/home" &&
      location.pathname.toLowerCase() !== "/"
    ) {
      if (auth.currentUser && params.markdownId) {
        updateMarkDown(auth.currentUser?.uid, params.markdownId);
      }
    } else {
      if (auth.currentUser) {
        createMarkDown(auth.currentUser.uid);
      }
    }
  };
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header loading={loading} clickHandler={clickHandler} />
      <div className="grid gap-x-1  bg-zinc-800 md:grid-cols-2">
        <MarkDown changeHandler={changeHandler} text={markDown} />
        <Preview text={markDown} />
      </div>
    </div>
  );
}
