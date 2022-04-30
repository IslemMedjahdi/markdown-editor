import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../core/firebaseConfig";
import { motion } from "framer-motion";
type PropsType = {
  markdownList: any[];
  loading: boolean;
  titles: any;
  uid: string;
  setTitles: (title: any) => void;
};

export default function MarkDownsList({
  markdownList,
  loading,
  titles,
  uid,
  setTitles,
}: PropsType) {
  const [search, setSearch] = useState("");
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const [loadingUpdate, setLoadingUpdate] = useState({
    id: "",
    loading: false,
  });
  const [markdownToDelete, setMarkdownToDelete] = useState({
    delete: false,
    id: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitles((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const updateTitleHandler = async (uid: string, markDownId: string) => {
    setLoadingUpdate({ id: markDownId, loading: true });
    const docRef = doc(db, "users", uid, "markdowns", markDownId);
    if (titles[markDownId].trim() !== "") {
      await updateDoc(docRef, {
        title: titles[markDownId],
        lastUpdate: Timestamp.now(),
      });
    }
    setLoadingUpdate({ id: "", loading: false });
  };
  const deleteMarkDown = async (uid: string, markDownId: string) => {
    const docRef = doc(db, "users", uid, "markdowns", markDownId);
    try {
      await deleteDoc(docRef);
    } catch (e) {
      console.log(e);
    }
    setMarkdownToDelete({ delete: false, id: "" });
  };
  return (
    <div className="flex w-full flex-col items-center space-y-5 py-5 px-2">
      <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
        <h1 className="text-center font-RMono text-2xl font-medium text-white underline">
          My Markdowns
        </h1>
        <div className="flex flex-1 items-center space-x-2 bg-zinc-700 px-5 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            value={search}
            onChange={searchHandler}
            placeholder="search"
            className="w-full overflow-auto whitespace-nowrap bg-transparent font-RMono font-medium text-white outline-none scrollbar-hide"
          />
        </div>
      </div>
      <Link
        to={"/Home"}
        className="font-RMono font-medium text-white hover:underline"
      >
        Create a new markdown file!
      </Link>
      {loading &&
        [1, 2, 3].map((item: number) => (
          <div
            key={item}
            className="flex h-48 w-10/12 animate-pulse flex-col space-y-5 rounded-lg bg-zinc-800 py-5 px-5 "
          ></div>
        ))}

      {markdownList.length !== 0 &&
        markdownList
          .filter((item: any) => item.title.toLowerCase().includes(search))
          .map((item: any, index: number) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3 * index,
              }}
              key={item.id}
              className="flex w-10/12 flex-col space-y-5 rounded-lg bg-zinc-800 py-5 px-5 "
            >
              <div className="space-y-5">
                <div className="flex w-full items-center space-x-2">
                  <p className="w-1/2 bg-zinc-900 px-5 py-2 font-RMono font-medium text-white">
                    Title
                  </p>
                  <p className="bg-zinc-800 px-1 py-2 font-RMono font-medium text-white">
                    :
                  </p>
                  <input
                    placeholder={item.title}
                    autoFocus={0 === index}
                    name={item.id}
                    value={titles[item.id]}
                    onChange={onChange}
                    className="w-1/2 overflow-auto whitespace-nowrap bg-zinc-700 px-5 py-2 font-RMono font-medium text-white outline-none scrollbar-hide"
                  />
                </div>
                <div className="flex w-full items-center space-x-2 ">
                  <p className="w-1/2 overflow-auto whitespace-nowrap bg-zinc-900 px-5 py-2 font-RMono font-medium text-white scrollbar-hide">
                    Last Update
                  </p>
                  <p className="bg-zinc-800 px-1 py-2 font-RMono font-medium text-white">
                    :
                  </p>
                  <p
                    className="w-1/2 overflow-auto whitespace-nowrap bg-zinc-900 px-5 py-2 font-RMono font-medium text-white scrollbar-hide
                "
                  >
                    {new Date(item.lastUpdate.seconds * 1000).toDateString()} ,{" "}
                    {new Date(
                      item.lastUpdate.seconds * 1000
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <hr />
              <div className="flex justify-between space-x-2 overflow-auto scrollbar-hide">
                <div>
                  <button
                    disabled={
                      titles[item.id] === item.title ||
                      titles[item.id].trim() === ""
                    }
                    onClick={() => updateTitleHandler(uid, item.id)}
                    className={`whitespace-nowrap bg-zinc-900 px-5 py-2 font-RMono font-medium text-white transition duration-200 ${
                      titles[item.id] !== item.title &&
                      titles[item.id].trim() !== ""
                        ? "hover:bg-zinc-700"
                        : "cursor-not-allowed"
                    }`}
                  >
                    {loadingUpdate.loading && loadingUpdate.id === item.id
                      ? "loading ..."
                      : "Update Title"}
                  </button>
                </div>
                <div className="flex space-x-2">
                  {markdownToDelete.id === item.id &&
                  markdownToDelete.delete ? (
                    <>
                      <button
                        onClick={() => deleteMarkDown(uid, item.id)}
                        className="bg-red-500 px-5 py-2 font-RMono font-medium text-white transition duration-200 hover:bg-red-400"
                      >
                        confirm
                      </button>
                      <button
                        onClick={() =>
                          setMarkdownToDelete({ delete: false, id: "" })
                        }
                        className="bg-zinc-900 px-5 py-2 font-RMono font-medium text-white transition duration-200 hover:bg-zinc-700"
                      >
                        cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMarkdownToDelete({ delete: true, id: item.id });
                      }}
                      className="bg-red-500 px-5 py-2 font-RMono font-medium text-white transition duration-200 hover:bg-red-400"
                    >
                      Delete
                    </button>
                  )}
                  <Link
                    className="bg-zinc-900 px-5 py-2 font-RMono font-medium text-white transition duration-200 hover:bg-zinc-700"
                    to={`/markdown/${item.id}`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
    </div>
  );
}
