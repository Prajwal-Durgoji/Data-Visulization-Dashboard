import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import "./UserLocation.css";
class UserLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: window.matchMedia("(min-width: 768px)").matches,
    };
  }
  componentDidMount() {
    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia("(min-width: 768px)").addListener(handler);
  }
  render() {
    var style = null;
    if (!this.state.matches) {
      style = {
        height: "45%",
        width: "82%",

        borderRadius: "10px",
      };
    } else {
      style = {
        height: "45%",
        width: "90%",
        borderRadius: "10px",
      };
    }
    return (
      <Map
        className="LocationMap"
        google={this.props.google}
        zoom={5}
        style={style}
        initialCenter={{
          lat: this.props.latitude,
          lng: this.props.logitude,
        }}
      >
        <Marker
          position={{ lat: this.props.latitude, lng: this.props.logitude }}
          label={this.props.username}
          key={this.props.userId}
        ></Marker>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAtQvdGuadu_gF0wgRtEwk18dK0GXR5_Ks",
})(UserLocation);
