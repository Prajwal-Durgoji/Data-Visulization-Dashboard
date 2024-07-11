import React from "react";
import "./UserDevice.css";
import Cookies from "universal-cookie";

class UserDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceStatus: 'Activated',
      // devices: {
      //   id: null,
      //   userId: "",
      //   email: "",
      //   deleted: false,
      // },
      devices: {},
      done: false,
    };
  }
  // fetch("https://basavahealing.org/api/device/getDetails/" + this.props.userId, requestOptions)

  handleDeviceStatusChange = (event) => {
    const deviceStatus = event.target.value;
    this.setState({ deviceStatus });
    alert(`Device has been ${deviceStatus}`);
  };

  componentDidMount() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        authorization: "Bearer " + token,
      },
    };
    fetch(`http://localhost:8080/api/auth/device/details/${this.props.userId}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.log("not ok");
        } else {
          let status = false;
          if (data != null) {
            status = true;
          }
          this.setState({
            devices: data, // set devices state to data.data
            done: status,
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.log("error caught");
        console.error("There was an error!", error);
      });
  }

  render() {
    return (
      <div className="UserDeviceDetails">
        <div className="UserDeviceDetailsHeading">
          <h2>Device Details</h2>
        </div>
        <div className="UserDeviceDetailsData">
          <div>
            <h5>MAC ID: </h5>
            <h5>{this.state.devices.macid}</h5>
          </div>
          <div>
            <h5>Activation Date: </h5>
            <h5>{this.state.devices.activationDate}</h5>
          </div>
        </div>
        <div className="radio-block">
          <input
            type="radio"
            name="animations"
            id="animations-on"
            value="Activated"
            checked={this.state.deviceStatus === 'Activated'}
            onChange={this.handleDeviceStatusChange}
          />
          <label id="button" htmlFor="animations-on">Activated</label>
          <input
            type="radio"
            name="animations"
            id="animations-off"
            value="Deactivated"
            checked={this.state.deviceStatus === 'Deactivated'}
            onChange={this.handleDeviceStatusChange}
          />
          <label id="button" htmlFor="animations-off" className="off-label">Disabled</label>
          <span className="selected" aria-hidden="true"></span>
        </div>
      </div>
    );
  }
}
export default UserDevice;
