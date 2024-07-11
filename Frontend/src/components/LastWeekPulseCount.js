import React from "react";

import Cookies from 'universal-cookie';
import {Line} from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';

import "react-datepicker/dist/react-datepicker.css";

import './LastWeekPulseCount.css';


class LastWeekPulseCount extends React.Component {
    
    
    constructor(props) {
        super(props);
        
        this.state = {
            res:{
                used: "1019",
                year: "2019",
                month: "1"
            },
            matches: window.matchMedia("(min-width: 768px)").matches,
            done:false
        };
        
    }
    
    
    
    componentDidMount() {
        const cookies = new Cookies();
        const token=cookies.get('token');
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-requested-with':'XMLHttpRequest',
                'authorization':'Bearer '+ token
            }
        };
        //console.log("date before fetch "+year);
        // fetch('https://basavahealing.org/api/getWeekUsage', requestOptions)
        fetch('http://localhost:8080/api/auth/totalReportsWeekly', requestOptions)
        .then(async response => {
            const data = await response.json();
            
            //console.log("asdf"); 
            // check for error response
            if (!response.ok) {
                console.log("not ok");
                
            }else{
                this.setState({ res:data, done: true });
            }
        })
        .catch(error => {
            console.log("error caught");
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
        
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 768px)").addListener(handler);
        
    }
    
    
    render() {
        
        //console.log("before ren"+this.state.startDate);
        //console.log("this.state.matches"+this.state.matches);
        var well={
            backgroundColor:"#f3f3f3",
            borderRadius:"10px",
            boxShadow: "0px 0px 10px 10px #02075d"
        }
        
        if(this.state.done){
            
            const barDet = {
                // labels: this.state.res.map(b=>b.year),
                labels: this.state.res.dates,
                datasets: [
                    {
                        label: 'Pulse Usage',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: '#030976',
                        borderWidth: 2,
                        // data:this.state.res.map(a => a.used)
                        data: this.state.res.pulseCounts
                    }
                ]
            }
            if(!this.state.matches){
                return (
                    <div id="canvas" className="LastWeekPulseCount" style={well}>
                    
                    <Line 
                    data={barDet}
                    
                    options={{
                        title:{
                            display:true,
                            text:'Pulse Usage in Last Week ',
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
                    width={600} height={600}
                    ></Line>
                    </div>
                    
                    );
                    
                }else{
                    
                    var mar={
                        margin: "30px",
                        padding:"5px"
                    }
                    
                    return (
                        <div style={mar} >
                        
                        <Row >
                        <Col sm="12" md={{ size: 6, offset: 3 }} style={well}>
                        <Line
                        data={barDet}
                        
                        options={{
                            title:{
                                display:true,
                                text:'Pulse Usage in Last Week ',
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
                        
                        </Col>
                        </Row>
                        </div>
                        
                        );
                        
                    }
                    
                }else{
                    return (
                        <div>
                        <h1>LastWeekPulseCount component Loading...</h1>
                        </div>
                        );
                    }
                }
            }
            
            export default LastWeekPulseCount;