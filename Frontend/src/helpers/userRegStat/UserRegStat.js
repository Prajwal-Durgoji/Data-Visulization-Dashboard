import React from 'react';
import './UserRegStat.css'
import Tabletop from 'tabletop';
import {Line} from 'react-chartjs-2';
import { connect } from "react-redux";
import Cookies from "universal-cookie";
//17n2KJPXTU0pNFoeEU12kaulj1Btunq_3AbRS1izKcxg
//https://docs.google.com/spreadsheets/d/e/2PACX-1vSyQCjkLGgxZkrY7IhYUJdPxA39yI5ZU2S8DQWhyk-KmZGUnoj7BTKd0GOCTcHVBtB3kR4AghBMyIQI/pubhtml?gid=1141051506&single=true

//https://spreadsheets.google.com/feeds/cells/17n2KJPXTU0pNFoeEU12kaulj1Btunq_3AbRS1izKcxg/1/public/full?alt=json
class UserRegStat extends React.Component {
    
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
    
    find_duplicate_in_array(array){
        const count = {}
        const result = []
        
        array.forEach(item => {
            if (count[item]) {
                count[item] +=1
                return
            }
            count[item] = 1
        })
        
        for (let prop in count){
            if (count[prop] >=2){
                result.push(prop)
            }
        }
        
        //console.log(count)
        return count;
        //return result;
        
    }
    
    
    render(){
        this.props.setTitle("Nadiswara Sales");
        let rechData = null;
        var enrolled_date =[];
        var date_labels=[]
        var values=[]
        var well={
            backgroundColor:"#f3f3f3",
            borderRadius:"10px",
            boxShadow: "0px 0px 10px 10px #02075d"
        }
        if (this.state.status) {
            rechData = this.state.data.map((row) => {
                let timestamp=row.Timestamp
                //(d.getMonth()+1)+"/"+d.getDate()
                var d = new Date(timestamp);
                enrolled_date.push(d.getFullYear()+"-"+(d.getMonth()+1))
                
                
                return (
                    <tr key={row.Timestamp} >
                    <td>{row.Name}</td>
                    <td>{row["Email Address"]}</td>
                    <td>{row.Email}</td>
                    <td>{row["Address (City)"]}</td>
                    <td>{row["Phone number"]}</td>
                    <td>{row["Name on Report"]}</td>
                    <td>{row["Choose the model"]}</td>
                    
                    </tr>
                    );
                });
                let userReg=this.find_duplicate_in_array(enrolled_date);
                for(var i in userReg){
                    date_labels.push(i);
                    values.push(userReg[i]);
                }
                
                //console.log(date_labels);
                //console.log(values);
                
                const barDet = {
                    labels: date_labels,
                    datasets: [
                        {
                            label: 'Nadiswara Sales Per Month',
                            fill: false,
                            lineTension: 0.5,
                            backgroundColor: 'rgba(75,192,192,1)',
                            borderColor: '#030976',
                            borderWidth: 2,
                            data:values
                        }
                    ]
                }
                
                return(

                    <div id="canvas" className="UserReg" style={well} >
                    
                    <Line 
                    data={barDet}
                    
                    options={{
                        title:{
                            display:true,
                            text:'Nadiswara Sales Per Month',
                            fontSize:20
                        },
                        scales: {
                            yAxes: [{
                                gridLines: {
                                    color: '#2a2a2b'
                                }
                            }],
                            xAxes: [{
                                gridLines: {
                                    color: '#2a2a2b'
                                }
                            }]
                        },
                        rotation:1,
                        legend:{
                            display:true,
                            position:'bottom'
                        }
                    }}
                    
                    ></Line>
                    </div>
                    )
                }
                
                
                return(
                    <div className="newUser">
                    
                    
                    </div>
                    )
                }
                
            }
            
            
            
            const mapDispatchToProps= dispatch =>{
                return{
                    setTitle: (title)=>{dispatch({type:"SET_TITLE",title:title})}
                }
            }
            
            export default connect(null,mapDispatchToProps)(UserRegStat)  