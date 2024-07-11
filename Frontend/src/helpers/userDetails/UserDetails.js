import React from "react";
import "./UserDetails.css";
import Cookies from "universal-cookie";

class UserDetails extends React.Component {
  constructor(props){
    super(props);
    this.state={
      user:{
        id:this.props.userId,
        email:this.props.email,
        name:this.props.name,
        phoneNumber:this.props.phoneNumber,
        model_number:this.props.model_number,
        address:this.props.address,
        houseNo: this.props.houseNo,
        landMark: this.props.landMark,
        pinCode: this.props.pinCode,
        country: this.props.country,
        state: this.props.state,
        city: this.props.city,
      }
    }
  }

  handleEmailChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.email = e.target.value
    this.setState({user: userUpdate});
  }

  handleNameChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.name = e.target.value
    this.setState({user: userUpdate});
  }

  // handleLastNameChange=(e)=>{
  //   let userUpdate={...this.state.user}
  //   userUpdate.lastName = e.target.value
  //   this.setState({user: userUpdate});
  // }

  handleMobileNumberChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.phoneNumber = e.target.value
    this.setState({user: userUpdate});
  }

  handleAddressChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.address = e.target.value
    this.setState({user: userUpdate});
  }

  
  handleHouseNoChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.houseNo = e.target.value
    this.setState({user: userUpdate});
  }

  handleLandMarkChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.landMark = e.target.value
    this.setState({user: userUpdate});
  }

  handlePinCodeChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.pinCode = e.target.value
    this.setState({user: userUpdate});
  }

  handleCountryChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.country = e.target.value
    this.setState({user: userUpdate});
  }

  handleStateChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.state = e.target.value
    this.setState({user: userUpdate});
  }
  
  handleCityChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.city = e.target.value
    this.setState({user: userUpdate});
  }

  handlePulseCountChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.pulseCount = e.target.value
    this.setState({user: userUpdate});
  }
  

  handleModelNameChange=(e)=>{
    let userUpdate={...this.state.user}
    userUpdate.model_number=e.target.value
    this.setState({user: userUpdate});
  }

  postDate=()=>{
    // console.log( JSON.stringify({user:{...this.state.user}}))
    console.log(JSON.stringify(this.state.user));
    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: 'PUT',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        authorization: "Bearer " + token,
      },
      // body:JSON.stringify({user:{...this.state.user}})
      body: JSON.stringify(this.state.user)
    };
    // fetch("https://basavahealing.org/api/users/email/"+this.state.user.username+"/update", requestOptions)
    fetch(`http://localhost:8080/api/auth/updateUser/${this.state.user.id}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.log("not ok");
          alert("error")
        } else {
          alert("done")
        }
      })
      .catch((error) => {
        alert("error")
        console.log("error caught");
        console.error("There was an error!", error);
      });
    
  }

  updateUser=(e)=>{
    console.log( JSON.stringify(this.state.user))
    if(this.state.user.model_number=="TCM"){
      console.log("1")
      this.postDate()
    }else if(this.state.user.model_number=="EH"){
      this.state.user.model_number="2"
      console.log("2")
      this.postDate()
    }else if(this.state.user.model_number=="TCM & EH"){
      this.state.user.model_number="3"
      console.log("3")
      this.postDate()
    }else{
      alert("Enter proper model")
    }
  }

  render() {
    return (
      <div className="UserDetailTable">
        <div className="UserDet">
          <div className="UserDetHeading">
            <h2>User Details</h2>
          </div>
          <div>
            <h5>ID: </h5>
            <h5>{this.props.userId}</h5>
          </div>

          <div>
            <h5>Email: </h5>
            <span> </span>
            <h5>{this.props.email}</h5>
            {/* <input type="text" value={this.state.user.email} onChange={this.handleEmailChange} /> */}
          </div>
          <div>
            <h5>Name: </h5>
            <h5>{this.state.name}</h5>
            <input type="text" value={this.state.user.name} onChange={this.handleNameChange} />
          </div>
          <div>
            {/* <h5>Last Name: </h5> */}
            {/* <h5>{this.state.lastName}</h5> */}
            {/* <input type="text" value={this.state.user.lastName} onChange={this.handleLastNameChange} /> */}
          </div>
          {/* <div>
            <h5>Email: </h5>
            <h5>{this.state.user.email}</h5>
          </div> */}
          <div>
            <h5>Mobile Number: </h5>
            <h5>{this.state.phoneNumber}</h5>
            <input type="text" value={this.state.user.phoneNumber} onChange={this.handleMobileNumberChange} />
          </div>
          <div>
            <h5>Address: </h5>
            <h5>{this.state.address} </h5>
            <input type="text" value={this.state.user.address} onChange={this.handleAddressChange} />
          </div>
          <div>
            {/* <h5>Status: </h5> */}
            {/* <h5>{this.props.active ? "Activated" : "Deleted"}</h5> */}
          </div>
          <div>
            <h5>House No: </h5>
            <input type="text" value={this.state.user.houseNo} onChange={this.handleHouseNoChange} />
          </div>
          <div>
            <h5>Landmark: </h5>
            <input type="text" value={this.state.user.landMark} onChange={this.handleLandMarkChange} />
          </div>
          <div>
            <h5>Pin Code: </h5>
            <input type="text" value={this.state.user.pinCode} onChange={this.handlePinCodeChange} />
          </div>
          <div>
            <h5>Country: </h5>
            <input type="text" value={this.state.user.country} onChange={this.handleCountryChange} />
          </div>
          <div>
            <h5>State: </h5>
            <input type="text" value={this.state.user.state} onChange={this.handleStateChange} />
          </div>
          <div>
            <h5>City: </h5>
            <input type="text" value={this.state.user.city} onChange={this.handleCityChange} />
          </div>
          {/* <div>
            <h5>Pulse Count: </h5>
            <input type="text" value={this.state.user.pulseCount} onChange={this.handlePulseCountChange} />
          </div> */}
          <div>
            <h5>Model: </h5>
            <h5>{this.state.model_number}</h5>
            <input type="text" value={this.state.user.model_number} onChange={this.handleModelNameChange} />
          </div>
          <div>
            <button className="updateBtn" onClick={this.updateUser}>Update</button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserDetails;
