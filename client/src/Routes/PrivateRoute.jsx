import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";
import axios from "axios";
import Spinner from "../components/Spinner";

const PrivateRoute = () => {
  const [auth] = useAuth();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`/api/user/user-auth`);
      if (res?.data?.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};

export default PrivateRoute;
