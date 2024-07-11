import React from "react";

import "./errorHandler.css";
import { Link } from "react-router-dom";

const errorHandler = (props) => {
  return (
    <div className="errorHandler">
      <div className="errorHandlerContent">
        <div className="errorHandlerHeader">
          {/* <h1>Security Alert</h1> */}
          <h1>{props.heading}</h1>
        </div>
        <div className="errorHandlerBody">
          <h6>{props.body}</h6>
          {/* <h6>For security purpose, Please Login </h6>
                    <Link to="/">Click to login</Link> */}

          {props.cancel ? <button onClick={props.remove}>Cancel</button> : null}
          {props.gotoLogin ? <Link to="/login">Click to login</Link> : null}
        </div>
        <div className="errorHandlerFooter"></div>
      </div>
    </div>
  );
};

export default errorHandler;
