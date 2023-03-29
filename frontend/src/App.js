import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { initAuth } from "./store/features/authSlice";
import { useDispatch } from "react-redux";
import CreateCustomer from "./components/CreateCustomer";
import CustomerInfo from "./components/CustomerInfo";
import CreateAppointment from "./components/CreateAppointment";
import AppointmentInfo from "./components/AppointmentInfo";
import Management from "./components/Management";
import PdfInvoice from "./components/PdfInvoice";
import { useSelector } from "react-redux";
import { fetchSpecies } from "./store/features/speciesSlice";
import { fetchStaff } from "./store/features/staffSlice";
import { fetchSupplies } from "./store/features/supplySlice";
import { fetchVatGroups } from "./store/features/vatGroupSlice";

function App() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initAuth());
  }, []);

  useEffect(() => {
    if (auth.loggedIn) {
      dispatch(fetchSpecies());
      dispatch(fetchSupplies());
      dispatch(fetchVatGroups());
      dispatch(fetchStaff());
    }
  }, [auth]);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/new-customer" element={<CreateCustomer />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/new-appointment" element={<CreateAppointment />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/new-appointment/:startdate"
            element={<CreateAppointment />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/customer/:id" element={<CustomerInfo />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/appointment/:id" element={<AppointmentInfo />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/management" element={<Management />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/invoice" element={<PdfInvoice />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
