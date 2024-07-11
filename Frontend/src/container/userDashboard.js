import React from "react";

import "./userDashboard.css";
import UserDevice from "../helpers/userDevice/UserDevice";
import UserTransaction from "../helpers/userTransaction/userTransaction";
import UserDetails from "../helpers/userDetails/UserDetails";
// import UserMonthlyUsage from "../helpers/userMonthlyUsage/userMonthlyUsage";
// import UserLocation from "../helpers/userLocation/UserLocation";

class userDashboard extends React.Component {
  render() {
    return (
      <div className="userDashboard">
        <div className="userDetailsDash">
          <UserDetails
            userId={this.props.userId}
            email={this.props.email}
            name={this.props.name}
            phoneNumber={this.props.phoneNumber}
            houseNo={this.props.houseNo}
            landMark={this.props.landMark}
            pinCode={this.props.pinCode}
            address={this.props.address}
            country={this.props.country}
            state={this.props.state}
            city={this.props.city}
            model_number={this.props.model_number}
          ></UserDetails>
        </div>
        <div className="userDetailsDash">
          <UserDevice
            userId={this.props.userId}
            macid={this.props.macid}
            activationDate={this.props.activationDate}
          ></UserDevice>
        </div>
        <div className="userDetailsDash">
          <UserTransaction userId={this.props.userId}></UserTransaction>
        </div>
        {/* <div className="userDetailsDash">
          <UserMonthlyUsage userId={this.props.userId}></UserMonthlyUsage>
        </div> */}
        {/* <div className="userLocation">
          <UserLocation
            latitude={this.props.latitude}
            logitude={this.props.logitude}
            userId={this.props.userId}
            username={this.props.username}
          ></UserLocation>
        </div> */}
      </div>
    );
  }
}

export default userDashboard;
