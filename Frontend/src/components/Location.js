import React from "react";
import Cookies from "universal-cookie";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";

import Loader from "react-loader-spinner";
import "./Location.css";
import { connect } from "react-redux";

import ErrorHandler from "./errorHandler/errorHandler";

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {
        createdBy: "",
        creationDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        id: "",
        username: "U",
        roles: [
          {
            role: "",
          },
          {
            role: "",
          },
        ],
        latitude: "",
        logitude: "",
        firstName: "A",
        lastName: "B",
        active: "",
        confirmationToken: "",
        mobileNumber: "",
        officeAddress: "",
        residencialAddress: "",
        tMac: "",
        dMac: "",
        resetToken: "",
        apkVersion: "",
        isEnrolled: true,
        model_number: "",
        deleted: "",
      },
      done: false,
      isOpen: false,
      selectedUser: {},
      showmodel: false,
      loading: true,
      showErrorDialog: false,
    };
    //console.log("Hi this is Location js  ");
  }

  fetchUserDetails = () => {
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
    fetch("https://basavahealing.org/api/users", requestOptions)
      .then(async (response) => {
        const data = await response.json();

        //console.log("asdf");
        // check for error response
        if (!response.ok) {
          console.log("not ok");
          // get error message from body or default to response status
          //const error = (data && data.message) || response.status;
          //console.error(error);
          //this.setState({ users: 'asd', done: false });
        } else {
          this.setState({ users: data, done: true, loading: false });
          //console.log(data[20])
        }
      })
      .catch((error) => {
        console.log("error caught");
        console.error("There was an error!", error);
      });
  };

  componentDidMount() {
    // POST request using fetch with error handling
    this.props.setTitle("Map");
    const cookies = new Cookies();
    const token = cookies.get("token");

    token
      ? this.fetchUserDetails()
      : this.setState({ showErrorDialog: true, loading: false });
  }

  handleToggleOpen = (data) => {
    var modelName = "TCM";
    if (data.model_number > 2) {
      modelName = "TCM & EH";
    }
    if (data.model_number > 1) {
      modelName = "EH";
    } else {
      modelName = "TCM";
    }

    var result1 = `ID : ${data.id}\nName :${data.firstName}\nEmail :${data.username}\nMobile Number :  ${data.mobileNumber}\nModel :  ${modelName}\nAddress :  ${data.residencialAddress}\nActive :  ${data.active}\nEnrolled Date :  ${data.lastModifiedDate}`;

    // var result1="ID :  "+data.id+"\n"+"Name :  "+data.firstName+"\t"+data.lastName+"\n"+"Email :  "+data.username+"\n"+"Mobile Number :  "+data.mobileNumber+"\n"+"Model :  "+modelName+
    // "\n"+"Address :  "+data.residencialAddress+"\n"+"Active :  "+data.active+"\n"+"Enrolled Date :  "+data.lastModifiedDate;
    //console.log("data"+result1);
    alert(result1);
  };

  hideUsageModal = () => {
    this.setState({
      showmodel: false,
    });
  };

  render() {
    const errorMsg = this.state.showErrorDialog ? (
      <ErrorHandler
        heading="Security Alert"
        body={"Please Login"}
        gotoLogin={true}
      ></ErrorHandler>
    ) : null;

    if (this.state.showErrorDialog) {
      return errorMsg;
    }
    if (this.state.loading) {
      return (
        <Loader
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-40%, -40%)",
          }}
          type="Grid"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={7000} //7 secs
        />
      );
    }
    var style = {
      height: "85%",
      width: "90%",
      boxShadow: "-3px -3px 7px #f5f5f5, 3px 3px 7px #bbc3cc",
    };
    if (this.state.done) {
      return (
        <div className="Location">
          <Map
            className="LocationMap"
            google={this.props.google}
            zoom={5}
            style={style}
            initialCenter={{
              lat: 20.895772,
              lng: 81.721996,
            }}
          >
            {this.state.users.map((marker) => (
              <Marker
                position={{ lat: marker.latitude, lng: marker.logitude }}
                label={marker.id.toString()}
                onClick={() => this.handleToggleOpen(marker)}
                key={marker.id}
              >
                {this.state.isOpen && (
                  <InfoWindow onCloseClick={() => this.handleToggleClose()}>
                    <span>Hiii</span>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </Map>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Hi this is santosh</h1>
        </div>
      );
    }
  }
}

//AIzaSyAtQvdGuadu_gF0wgRtEwk18dK0GXR5_Ks

const mapDispatchToProps = (dispatch) => {
  return {
    setTitle: (title) => {
      dispatch({ type: "SET_TITLE", title: title });
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(
  GoogleApiWrapper({
    apiKey: "AIzaSyBmER-7E97Pb50d3bCjordhZTtJUM3B4TE",
  })(Location)
);

/*


    <div >
                        <Map
                            google={this.props.google}
                            zoom={10}
                            style={style}
                            initialCenter={{
                                lat: res.latitude,
                                lng: res.logitude
                            }}
                            >
                            <Marker
                            onClick={this.onMarkerClick}
                            name={res.username}
                            />
                        </Map>
                        </div>


*/
