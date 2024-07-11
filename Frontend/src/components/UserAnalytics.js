import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import UserUsage from "./UserUsage";
import UserDayUsage from "./UsersDayUsage";
import UserLastSevDaysUsage from "./UserLastSevDaysUsage";
import UsersMonthUsage from "./UsersMonthUsage";
import UsersYearUsage from "./UsersYearUsage";
import "./UserAnalytics.css";
import Cookies from "universal-cookie";
import ErrorHandler from "./errorHandler/errorHandler";

const cookies = new Cookies();

const userUsage = (
  <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
    <Tab eventKey="today" title="Today">
      <UserDayUsage></UserDayUsage>
    </Tab>
    <Tab eventKey="lastweek" title="Last 7 days">
      <UserLastSevDaysUsage></UserLastSevDaysUsage>
    </Tab>
    <Tab eventKey="month" title="Month">
      <UsersMonthUsage></UsersMonthUsage>
    </Tab>
    <Tab eventKey="year" title="Year">
      <UsersYearUsage></UsersYearUsage>
    </Tab>
    <Tab eventKey="Usage" title="User Usage">
      <UserUsage></UserUsage>
    </Tab>
  </Tabs>
);

const errorHandler = (
  <ErrorHandler
    heading="Security Alert"
    body={"Please Login"}
    gotoLogin={true}
  ></ErrorHandler>
);

export const UserAnalytics = () => (
  <div className="UserAnalytics">
    {cookies.get("token") ? userUsage : errorHandler}
  </div>
);
