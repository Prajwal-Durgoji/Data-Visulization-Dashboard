import React from "react";
import "./DistributorDashboard.css";

import DistributorDetails from "../helpers/distributorDetails/DistributorDetails";

class DistributorDashboard extends React.Component{
    render(){
        return(
            <div className="DistributorDashboard">
                <div classname="distributorDetailsDash">
                    <DistributorDetails
                        distributorId={this.props.distributorId}
                        email={this.props.email}
                        name={this.props.name}
                        phoneNumber={this.props.phoneNumber}
                        country={this.props.country}
                        state={this.props.state}
                        city={this.props.city}
                    ></DistributorDetails>
                </div>
            </div>
        )
    }
}
export default DistributorDashboard;