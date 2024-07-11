import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import DayPulseCount from "./components/DayPulseCount";
import YearPulseCount from "./components/YearPulseCount";
import LastWeekPulseCount from "./components/LastWeekPulseCount";
import MonthPulseCount from "./components/MonthPulseCount";
import "./NoMatch.css";
import Cookies from "universal-cookie";
import ErrorHandler from "./components/errorHandler/errorHandler";

const pulseUsage = (
  <div className="PulseCount">
    <Tabs defaultActiveKey="today" id="uncontrolled-tab-example">
      <Tab eventKey="today" title="Today">
        <DayPulseCount></DayPulseCount>
      </Tab>
      <Tab eventKey="lastweek" title="Last 7 days">
        <LastWeekPulseCount></LastWeekPulseCount>
      </Tab>
      <Tab eventKey="month" title="Month">
        <MonthPulseCount></MonthPulseCount>
      </Tab>
      <Tab eventKey="year" title="Year">
        <YearPulseCount></YearPulseCount>
      </Tab>
    </Tabs>
  </div>
);

const errorHandler = (
  <ErrorHandler
    heading="Security Alert"
    body={"Please Login"}
    gotoLogin={true}
  ></ErrorHandler>
);

const tokenStatus = () => {
  const cookies = new Cookies();
  return cookies.get("token");
};
export const NoMatch = () => (
  <div className="NoMatch">{tokenStatus() ? pulseUsage : errorHandler}</div>
);
