import { deleteDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../core/firebaseConfig";

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
    await updateDoc(docRef, {
      title: titles[markDownId],
      lastUpdate: Timestamp.now(),
    });
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
      <h1 className="font-RMono text-2xl font-medium text-white underline">
        My Markdowns
      </h1>
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
            className="flex h-32 w-10/12 animate-pulse flex-col space-y-5 rounded-lg bg-zinc-800 py-5 px-5 "
          ></div>
        ))}

      {markdownList.length !== 0 &&
        markdownList.map((item: any, index: number) => (
          <div
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
                  onClick={() => updateTitleHandler(uid, item.id)}
                  className="whitespace-nowrap bg-zinc-900 px-5 py-2 font-RMono font-medium text-white transition duration-200 hover:bg-zinc-700"
                >
                  {loadingUpdate.loading && loadingUpdate.id === item.id
                    ? "loading ..."
                    : "Update Title"}
                </button>
              </div>
              <div className="flex space-x-2">
                {markdownToDelete.id === item.id && markdownToDelete.delete ? (
                  <>
                    <button
                      onClick={() => deleteMarkDown(uid, item.id)}
                      className="bg-red-500 px-5 py-2 font-RMono font-medium text-white"
                    >
                      confirm
                    </button>
                    <button
                      onClick={() =>
                        setMarkdownToDelete({ delete: false, id: "" })
                      }
                      className="bg-zinc-900 px-5 py-2 font-RMono font-medium text-white"
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
          </div>
        ))}
    </div>
  );
}
