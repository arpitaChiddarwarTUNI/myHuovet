import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";

import Loading from "./Loading";
const ProtectedRoute = () => {
  const auth = useSelector((state) => state.auth);
  if (auth.loading || auth.loadingFromRefresh) {
    return <Loading></Loading>;
  }

  if (!auth.loggedIn) {
    return <Navigate to="/" />;
  }

  // returns child route elements
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
export default ProtectedRoute;
