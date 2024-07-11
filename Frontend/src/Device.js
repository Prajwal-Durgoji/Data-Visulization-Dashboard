import React from "react";
import DeviceComponent from "./components/DeviceComponent";
import "./Device.css";
import Cookies from "universal-cookie";
import ErrorHandler from "./components/errorHandler/errorHandler";

const cookies = new Cookies();
// const token = cookies.get("token");

const errorHandler = (
  <ErrorHandler
    heading="Security Alert"
    body={"Please Login"}
    gotoLogin={true}
  ></ErrorHandler>
);

export const Device = () => (
  <div className="Device">
    {cookies.get("token") ? <DeviceComponent></DeviceComponent> : errorHandler}
  </div>
);
