import React from "react";

import Cookies from 'universal-cookie';
import {Bar} from 'react-chartjs-2';
import {HorizontalBar} from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';

 
import "react-datepicker/dist/react-datepicker.css";
 


class UserUsage extends React.Component {

  
    constructor(props) {
      super(props);
     
      this.state = {
          res:{
            name: "1019",
            pulseused: "2019",
            email: "1"
          },
          matches: window.matchMedia("(min-width: 768px)").matches,
        done:false
    };
     
    }



    /*handleChange = date => {
        this.setState({
          startDate: date.getFullYear()
        });

        this.state.done=false;
        console.log("Modified Date is:"+date.getFullYear())
        this.fetchData(date.getFullYear());
      };*/

    componentDidMount() {
        const cookies = new Cookies();
        const token=cookies.get('token');
        const requestOptions = {
            method: 'GET',
            headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-requested-with':'XMLHttpRequest',
            'authorization':'Bearer '+token
         }
        };
        
        fetch('https://basavahealing.org/api/users/getUsage', requestOptions)
            .then(async response => {
                const data = await response.json();
    
                //console.log("asdf"); 
                // check for error response
                if (!response.ok) {
                    console.log("not ok");
                    // get error message from body or default to response status
                    //const error = (data && data.message) || response.status;
                    //console.error(error);
                    //this.setState({ users: 'asd', done: false });
                }else{
                    this.setState({ res:data, done: true });
                    
                    //console.log(this.state.res)
                    //console.log(this.state.res.map(a => a.used))
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
        var well={   
            boxShadow: "0px 0px 10px 10px #163939",
            overflow : 'auto'
        }
        var mar={
            margin: "30px",
            padding:"5px",
            width: '3000px',
           
        }

        if(this.state.done){
            //this.state.datasets.data=this.state.res;
           // {this.state.res.map((data, key) => {
               
            const barDet = {
                labels: this.state.res.map(a => a.email),
                datasets: [
                  {
                    label: 'Usage by',
                    fill: false,
                    lineTension: 0.5,
                    strokeColor: "rgba(220,220,220,0.8)",
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data:this.state.res.map(a => a.pulseused)
                  }
                ]
            }
            
            if(!this.state.matches){

                return (
                    <div>
                        
                    <HorizontalBar
                        data={barDet}
                        options={{
                            title:{
                            display:true,
                            text:'Pulse Usage by Each User',
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
                            legend:{
                            display:true,
                            position:'bottom'
                            }
                        }}
                        width={600} height={5000}
                    />
                    </div>
                    //)})};
                );

            }else{

                return (
                    <div style={mar}>
                     <Row>
                        <Col sm="12" md={{ size: 9, offset: 0 }} style={well}>
                    <Bar
                        data={barDet}
                        options={{
                            title:{
                            display:true,
                            text:'Pulse Usage by Each User',
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
                            legend:{
                            display:true,
                            position:'bottom'
                            }
                        }}
                        width={600} height={200}
                    />
                    </Col>
                    </Row>
                    </div>
                    
                    //)})};
                );


            }
            
        }else{
            return (
                <div>
                    <h1>user Usage is Loading...</h1>
                </div>
                );
        }
    }
}

export default UserUsage;