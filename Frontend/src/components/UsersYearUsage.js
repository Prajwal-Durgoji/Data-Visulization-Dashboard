import React from "react";

import Cookies from 'universal-cookie';
import { Bar } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';
import { Row, Col } from 'reactstrap';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class UsersYearUsage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            res: {
                name: "1019",
                pulseused: "2019",
                email: "1"
            },
            // startDate: new Date().getFullYear(),
            startDate: new Date(),
            matches: window.matchMedia("(min-width: 768px)").matches,
            done: false
        };

    }

    handleChange = date => {
        this.setState({
            startDate: date,
            done: false
        });

        //this.state.done=false;
        //console.log("Modified Date is:"+date)
        this.fetchData(date);
    };

    fetchData = date => {
        // var selectedDate = date;
        var selectedDate = date.getFullYear().toString();
        //console.log("date :::::: "+selectedDate);
        // POST request using fetch with error handling
        const cookies = new Cookies();
        const token = cookies.get('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
                'authorization': 'Bearer ' + token
            }
        };
        //console.log("date before fetch "+selectedDate);
        // fetch('https://basavahealing.org/api/users/getUsageByYear/' + selectedDate, requestOptions)
        fetch('http://localhost:8080/api/auth/userData/year/' + selectedDate, requestOptions)
            .then(async response => {
                const data = await response.json();
                //console.log("Day pulse count"+data); 
                // check for error response
                if (!response.ok) {
                    console.log("not ok");
                    // get error message from body or default to response status
                    //const error = (data && data.message) || response.status;
                    //console.error(error);
                    //this.setState({ users: 'asd', done: false });
                } else {
                    //console.log("After fetch operation:::"+data)
                    //data=10;
                    this.setState({ res: data, done: true });
                    //console.log(data)
                }


            })
            .catch(error => {
                console.log("error caught");
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });

    }

    componentDidMount() {
        this.fetchData(this.state.startDate);
        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 768px)").addListener(handler);
    }


    render() {
        var well = {
            boxShadow: "0px 0px 10px 10px #163939"
        }
        var mar = {
            margin: "30px",
            padding: "5px",
            width: '1800px'
        }

        if (this.state.done) {
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
                        data: this.state.res.map(a => a.pulseCount)
                    }
                ]
            }

            if (!this.state.matches) {
                return (
                    <div>
                        <div style={{ float: 'right' }}>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}

                                showYearPicker
                                dateFormat="yyyy"
                            />
                        </div>
                        <HorizontalBar
                            data={barDet}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Pulse Usage by Each User on ' + new Date(this.state.startDate).getFullYear(),
                                    fontSize: 20
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
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                }
                            }}
                            width={600} height={5000}
                        />
                    </div>
                    //)})};
                );
            } else {
                return (
                    <div style={mar}>
                        <Row>
                            <Col>
                                <div style={{ float: 'left' }}>
                                    <DatePicker
                                        selected={this.state.startDate}
                                        onChange={this.handleChange}
                                        showYearPicker
                                        dateFormat="yyyy"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 9, offset: 0 }} style={well}>
                                <Bar
                                    data={barDet}
                                    options={{
                                        title: {
                                            display: true,
                                            text: 'Pulse Usage by Each User on ' + new Date(this.state.startDate).getFullYear(),
                                            fontSize: 20
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
                                        legend: {
                                            display: true,
                                            position: 'bottom'
                                        }
                                    }}
                                    width={600} height={300}
                                />
                            </Col>
                        </Row>
                    </div>
                    //)})};
                );
            }

        } else {
            return (
                <div>
                    <h1>user Usage is Loading...</h1>
                </div>
            );
        }
    }
}

export default UsersYearUsage;