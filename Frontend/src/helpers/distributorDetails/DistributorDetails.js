import React from "react";
import Cookies from "universal-cookie";
import "./DistributorDetails.css";

class DistributorDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distributor: {
                id: this.props.distributorId,
                email: this.props.email,
                name: this.props.name,
                phoneNumber: this.props.phoneNumber,
                country: this.props.country,
                state: this.props.state,
                city: this.props.city
            }
        }
    }

    handleEmailChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.email = e.target.value
        this.setState({ distributor: distributorUpdate });
    }

    handleNameChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.name = e.target.value
        this.setState({ distributor: distributorUpdate });
    }

    handleMobileNumberChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.phoneNumber = e.target.value
        this.setState({ distributor: distributorUpdate });
    }

    handleCountryChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.country = e.target.value
        this.setState({ distributor: distributorUpdate });
    }

    handleStateChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.state = e.target.value
        this.setState({ distributor: distributorUpdate });
    }

    handleCityChange = (e) => {
        let distributorUpdate = { ...this.state.distributor }
        distributorUpdate.city = e.target.value
        this.setState({ distributor: distributorUpdate });
    }


    postDate = () => {
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
            body: JSON.stringify(this.state.distributor)
        };
        // fetch("https://basavahealing.org/api/users/email/"+this.state.user.username+"/update", requestOptions)
        fetch(`http://localhost:8080/api/auth/updateDistributor/${this.state.distributor.id}`, requestOptions)
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

    updateDistributor = () => {
        this.postDate();
    }

    render() {
        return (
            <div className="DistributorDetailTable">
                <div className="DistributorDet">
                {/* <h2>Distributor Details</h2> */}
                    <div>
                        <h5>ID: </h5>
                        <h5>{this.props.distributorId}</h5>
                    </div>
                    <div>
                        <h5>Email: </h5>
                        <h5>{this.props.email}</h5>
                        {/* <input type="text" value={this.state.distributor.email} onChange={this.handleEmailChange} /> */}
                    </div>
                    <div>
                        <h5>Name: </h5>
                        {/* <h5>{this.props.name}</h5> */}
                        <input type="text" value={this.state.distributor.name} onChange={this.handleNameChange} />
                    </div>
                    <div>
                        <h5>Mobile Number: </h5>
                        {/* <h5>{this.props.phoneNumber}</h5> */}
                        <input type="text" value={this.state.distributor.phoneNumber} onChange={this.handleMobileNumberChange} />
                    </div>
                    <div>
                        <h5>Country: </h5>
                        {/* <h5>{this.props.country}</h5> */}
                        <input type="text" value={this.state.distributor.country} onChange={this.handleCountryChange} />
                    </div>
                    <div>
                        <h5>State: </h5>
                        {/* <h5>{this.props.state}</h5> */}
                        <input type="text" value={this.state.distributor.state} onChange={this.handleStateChange} />
                    </div>
                    <div>
                        <h5>City: </h5>
                        {/* <h5>{this.props.city}</h5> */}
                        <input type="text" value={this.state.distributor.city} onChange={this.handleCityChange} />
                    </div>
                    <div>
                        <button onClick={this.updateDistributor}>Update</button>
                    </div>
                </div>
            </div>

        )
    }



}

export default DistributorDashboard;

