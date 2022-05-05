import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MarkDownsList from "../components/MarkDownsList";
import { db, auth } from "../core/firebaseConfig";
import background from "../assets/backgroundLogin.png";
import profilePic from "../assets/empty-profile.png";
import { storage } from "../core/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

export default function Profile() {
  const [user, setUser] = useState(auth?.currentUser);
  const [titles, setTitles] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [markdownList, setMarkdownList] = useState<any>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);
  useEffect(() => {
    if (user) {
      const unSub = onSnapshot(
        query(
          collection(db, "users", user.uid, "markdowns"),
          orderBy("lastUpdate")
        ),
        (querySnapshot) => {
          setLoading(true);
          let newMarkDownList: any[] = [];
          querySnapshot.forEach((doc) => {
            setTitles((prevState: any) => ({
              ...prevState,
              [doc.id]: doc.data().title,
            }));
            newMarkDownList = [
              { ...doc.data(), id: doc.id },
              ...newMarkDownList,
            ];
          });
          setMarkdownList(newMarkDownList);
          setLoading(false);
        }
      );
      return () => unSub();
    }
  }, [user]);
  const [loadingUploadImage, setLoadingUploadImage] = useState(false);

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoadingUploadImage(true);
    if (e.target.files && user) {
      console.log(e.target.files);
      const fileRef = ref(storage, user?.uid + ".png");
      await uploadBytes(fileRef, e.target.files[0]);
      const photoURL = await getDownloadURL(fileRef);
      await updateProfile(user, { photoURL });
    }
    setLoadingUploadImage(false);
  };
  return (
    <div className="min-h-screen bg-zinc-900">
      <Helmet>
        <title>Profile | Markdown Online Editor</title>
      </Helmet>
      <Header />
      <div className="grid place-items-center lg:grid-cols-2">
        <motion.div
          initial={{ x: "-50vw" }}
          animate={{ x: 0 }}
          transition={{
            duration: 0.4,
            x: { type: "spring", stiffness: 50 },
          }}
          style={{ backgroundImage: `url(${background})` }}
          className="flex  w-full justify-center bg-cover"
        >
          <div className="flex h-[92vh] w-5/6 flex-col items-center justify-center  space-y-5  md:w-11/12 lg:w-5/6">
            <h1 className="font-RMono text-2xl font-medium text-white underline">
              My Profile
            </h1>
            <div className="relative">
              <img
                src={user?.photoURL || profilePic}
                className={`${
                  loadingUploadImage && "animate-pulse"
                } h-24 w-24 rounded-full object-cover transition duration-200 hover:brightness-50`}
                alt="profile-pic"
              />
              <div className="group  absolute top-0 flex h-full w-full items-center justify-center overflow-hidden rounded-full hover:bg-black hover:bg-opacity-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`absolute h-6 w-6 text-white  opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    loadingUploadImage && "hidden"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <input
                  title="change your profile picture"
                  disabled={loadingUploadImage}
                  className="h-full cursor-pointer opacity-0 file:cursor-pointer "
                  type={"file"}
                  multiple={false}
                  accept={"image/*"}
                  onChange={onImageChange}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
              <p className="w-5/6  overflow-auto whitespace-nowrap bg-zinc-800 px-5 py-2 font-RMono font-medium text-white scrollbar-hide lg:w-1/2">
                Display name
              </p>
              <p className="hidden bg-zinc-800 px-1 py-2 font-RMono font-medium text-white lg:block">
                :
              </p>
              <p className="w-5/6 overflow-auto whitespace-nowrap bg-zinc-700 px-5 py-2 font-RMono font-medium text-white scrollbar-hide lg:w-1/2">
                {user?.displayName}
              </p>
            </div>
            <div className="flex w-full flex-col  items-center space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
              <p className="w-5/6 bg-zinc-800  px-5 py-2 font-RMono font-medium text-white lg:w-1/2">
                Email
              </p>
              <p className="hidden bg-zinc-800 px-1 py-2 font-RMono font-medium text-white lg:block">
                :
              </p>
              <p className=" w-5/6 overflow-auto whitespace-nowrap bg-zinc-700 px-5 py-2 font-RMono font-medium text-white scrollbar-hide lg:w-1/2">
                {user?.email}
              </p>
            </div>
          </div>
        </motion.div>
        <div className="h-[92vh] w-full self-start overflow-auto scrollbar-track-gray-100 scrollbar-thumb-neutral-800 scrollbar-hide md:scrollbar-thin md:scrollbar-default">
          <MarkDownsList
            titles={titles}
            setTitles={setTitles}
            loading={loading}
            markdownList={markdownList}
            uid={user?.uid || ""}
          />
        </div>
      </div>
    </div>
  );
}
