import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
type PropsHeader = {
  clickHandler?: () => void;
  loading?: boolean;
};

export default function Header({ clickHandler, loading }: PropsHeader) {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(auth.currentUser);
  const SignOutHandler = () => {
    signOut(auth).then(() => navigate("/login", { replace: true }));
    localStorage.clear();
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  return (
    <div className="sticky top-0  flex h-[8vh] items-center justify-center bg-zinc-800 md:justify-between md:px-10">
      <div className="hidden md:block">
        <Link
          className=" font-RMono font-medium tracking-widest text-white"
          to={"/Home"}
          reloadDocument
        >
          MARKDOWN
        </Link>
      </div>
      <div className="flex items-center space-x-4 overflow-x-auto px-2 scrollbar-hide md:px-0">
        {user ? (
          <>
            <Link
              to={"/Home"}
              className="whitespace-nowrap bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600 md:hidden"
              reloadDocument
            >
              Home
            </Link>
            {location.pathname.toLowerCase() !== "/settings" &&
              location.pathname.toLowerCase() !== "/profile" && (
                <button
                  disabled={loading}
                  onClick={clickHandler}
                  className="whitespace-nowrap bg-red-500 px-5 py-2 font-RMono text-sm font-medium text-white transition duration-300 hover:bg-red-400 "
                >
                  {loading ? "loading..." : "Save Changes"}
                </button>
              )}
            <Link
              to={"/Profile"}
              className="whitespace-nowrap bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600"
            >
              {user.displayName}
            </Link>
            <Link
              to={"/Settings"}
              className="bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600"
            >
              Settings
            </Link>
            <button
              onClick={SignOutHandler}
              className="whitespace-nowrap break-normal bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600 active:bg-red-500"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              className="bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600"
              to={"/login"}
            >
              Log In
            </Link>
            <Link
              className="bg-neutral-700 px-5 py-2 font-RMono text-sm font-medium text-white transition-colors duration-300 hover:bg-neutral-600"
              to={"/sign-up"}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
