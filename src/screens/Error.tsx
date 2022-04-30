import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();
  useEffect(() => {
    if (navigate) navigate("/Home", { replace: true });
  }, [navigate]);
  return <div>Error</div>;
}
