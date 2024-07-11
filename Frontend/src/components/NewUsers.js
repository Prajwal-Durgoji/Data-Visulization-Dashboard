import React from 'react';
import './NewUsers.css'
import Tabletop from 'tabletop';
import Cookies from "universal-cookie";
import { connect } from "react-redux";
//17n2KJPXTU0pNFoeEU12kaulj1Btunq_3AbRS1izKcxg
//https://docs.google.com/spreadsheets/d/e/2PACX-1vSyQCjkLGgxZkrY7IhYUJdPxA39yI5ZU2S8DQWhyk-KmZGUnoj7BTKd0GOCTcHVBtB3kR4AghBMyIQI/pubhtml?gid=1141051506&single=true

//https://spreadsheets.google.com/feeds/cells/17n2KJPXTU0pNFoeEU12kaulj1Btunq_3AbRS1izKcxg/1/public/full?alt=json
class NewUsers extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            data: [],
            status:false,
            showModel:false,
            user:{
                username:"",
                firstName:"",
                lastName:"",
                mobileNumber:"",
                model_number:"",
                residencialAddress:""
            }
        }
    }
    
    componentDidMount() {
        Tabletop.init({
            key: '17n2KJPXTU0pNFoeEU12kaulj1Btunq_3AbRS1izKcxg',
            callback: googleData => {
                this.setState({
                    data: googleData.reverse(),status:true
                })
            },
            simpleSheet: true
        })
    }
    
    handleFirstNameChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.firstName=e.target.value
        this.setState({user: userUpdate});
    }
    
    handleLastNameChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.lastName=e.target.value
        this.setState({user: userUpdate});
    }
    
    handleMobileNumberChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.mobileNumber=e.target.value
        this.setState({user: userUpdate});
    }
    
    handleAddressChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.residencialAddress=e.target.value
        this.setState({user: userUpdate});
    }
    
    handleModelNameChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.model_number=e.target.value
        this.setState({user: userUpdate});
    }
    
    handleEmailChange=(e)=>{
        let userUpdate={...this.state.user}
        userUpdate.username=e.target.value
        this.setState({user: userUpdate});
    }
    
    
    addNewUser=(row)=>{
        //let newuser = e.target.getAttribute('data-item');
        console.log(row);
        let newuser={
            "username":row["Email"],
            "firstName":row["Name on Report"],
            "lastName":"",
            "mobileNumber":row["Phone number"],
            "model_number":this.getModel(row["Choose the model"]),
            "residencialAddress":row["Address (City)"]
        }
        this.setState({showModel:true,user:{...newuser}});
    }
    
    postDate=()=>{
        
        alert(JSON.stringify({user:{...this.state.user},"userRole": [{ "role": "DOCTOR"}]}))
        
        if(this.state.user.lastName==="" || this.state.user.lastName == null){
            alert("LastName cannot be null")
        }else{
            const cookies = new Cookies();
            const token = cookies.get("token");
            const requestOptions = {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-requested-with": "XMLHttpRequest",
                    authorization: "Bearer " + token,
                },
                body:JSON.stringify({user:{...this.state.user},"userRole": [{ "role": "DOCTOR"}]})
            };
            fetch("https://basavahealing.org/api/users/create", requestOptions)
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
    }
    
    getModel=(model)=>{
        if(model=="Nadiswara"){
            console.log("1")
            return "1";
        }else if(model=="Nadiswara Impulsionscope"){
            console.log("2")
            return "2";
        }else if(model=="Both"){
            console.log("3")
            return "3";
        }else{
            alert("Enter proper model")
        }
    }
    
    updateUser=(e)=>{
        this.postDate()
    }
    
    render(){
        this.props.setTitle("Google Form");
        let rechData = null;
        
        if(this.state.showModel){
            return(
                <div className="NewUserDet">
                <div className="NewUserDetHeading">
                <h2>User Details</h2>
                </div>
                
                <div className="NewUserDetails">
                <h5>First Name: </h5>
                <input type="text" value={this.state.user.firstName} onChange={this.handleFirstNameChange} />
                </div>
                <div className="NewUserDetails">
                <h5>Last Name: </h5>
                <input type="text" value={this.state.user.lastName} onChange={this.handleLastNameChange} />
                </div>
                <div className="NewUserDetails">
                <h5>Email: </h5>
                <input type="text" value={this.state.user.username} onChange={this.handleEmailChange} />
                </div>
                <div className="NewUserDetails">
                <h5>Mobile Number: </h5>
                <input type="text" value={this.state.user.mobileNumber} onChange={this.handleMobileNumberChange} />
                </div>
                <div className="NewUserDetails">
                <h5>Address: </h5>
                <input type="text" value={this.state.user.residencialAddress} onChange={this.handleAddressChange} />
                </div>
                <div className="NewUserDetails">
                <h5>Model: </h5>
                <input type="text" value={this.state.user.model_number} onChange={this.handleModelNameChange} />
                </div>
                
                <div className="NewUserDetails">
                <button className="updateBtn" onClick={this.updateUser}>Update</button>
                </div>
                
                </div>
                );
            }
            if (this.state.status) {
                rechData = this.state.data.map((row) => {
                    return (
                        <tr className="newUserTableRow" key={row.Timestamp} data-item={row} onClick={()=>this.addNewUser(row)}>
                        <td>{row.Name}</td>
                        <td>{row["Email Address"]}</td>
                        <td>{row.Email}</td>
                        <td>{row["Address (City)"]}</td>
                        <td>{row["Phone number"]}</td>
                        <td>{row["Name on Report"]}</td>
                        <td>{row["Choose the model"]}</td>
                        
                        <td>{row["Date"]}</td>
                        <td>{row["Amount paid"]}</td>
                        <td>{row["Balance Amount"]}</td>
                        
                        <td>{row.Country}</td>
                        <td>{row.State}</td>
                        
                        <td>{row["Transaction mode"]}</td>
                        <td>{row["To whom amount has been paid"]}</td>
                        <td>{row["Micro USB type"]}</td>
                        <td>{row["Device Barcode"]}</td>
                        <td>{row["Referred person Name or ID"]}</td>
                        </tr>
                        );
                    });
                }
                
                
                return(
                    <div className="newUser">
                    
                    <table className="styled-table">
                    <thead>
                    <tr className="newUserTableHeader">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Email on Report</th>
                    <th>Address</th>
                    <th>Phone number</th>
                    <th>Name on Report</th>
                    <th>model</th>
                    <th>Date</th>
                    <th>Amount paid</th>
                    <th>Balance Amount</th>
                    <th>Country</th>
                    <th>State</th>
                    <th>Transaction mode</th>
                    <th>Amount paid to</th>
                    <th>USB type</th>
                    <th>Barcode</th>
                    <th>Referred person</th>
                    </tr>
                    </thead>
                    <tbody className="userTransactionTableBody">{rechData}</tbody>
                    </table>
                    </div>
                    )
                }
                
            }
            
            
            const mapDispatchToProps= dispatch =>{
                return{
                    setTitle: (title)=>{dispatch({type:"SET_TITLE",title:title})}
                }
            }
            
            export default connect(null,mapDispatchToProps)(NewUsers)  