import React from "react";

import Cookies from 'universal-cookie';
import { Bar } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import { Row, Col } from 'reactstrap';

import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import { connect } from 'react-redux';
 
class UsersDayUsage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            res: {
                name: "1019",
                pulseused: "2019",
                email: "1"
            },
            startDate: new Date(),
            matches: window.matchMedia("(min-width: 768px)").matches,
            done: false,
            loading: true
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
        // var selectedDate = date.getDate() + '/' + (parseInt(date.getMonth()) + parseInt(1)) + '/' + date.getFullYear();
        // var selectedDate = date.toISOString().split('T')[0];
        var selectedDate = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
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
        fetch('http://localhost:8080/api/auth/userData/today/' + selectedDate, requestOptions)
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
                    this.setState({ res: data, done: true, loading: false });
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
        this.props.setTitle("Users Usage");
        var well = {
            //backgroundColor:"#f3f3f3",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 10px #163939",
        }
        var mar = {
            margin: "30px",
            padding: "5px"
        }
        if (this.state.loading) {
            return (
                <Loader style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-40%, -40%)" }}
                    type="Grid"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={7000} //7 secs

                />
            );
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
                        strokeColor: "#163939",
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        // data: this.state.res.map(a => a.pulseused)
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
                                showMonthYearDropdown
                            //showYearPicker
                            //dateFormat="yyyy"
                            />
                        </div>
                        <HorizontalBar
                            data={barDet}
                            options={{

                                title: {
                                    display: true,
                                    text: 'Pulse Usage by Each User on ' + this.state.startDate.getDate() + '/' + (parseInt(this.state.startDate.getMonth()) + parseInt(1)) + '/' + this.state.startDate.getFullYear(),
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
                            width={600} height={600}
                        />
                    </div>
                    //)})};
                );
            } else {

                return (
                    <div style={mar} >
                        <div style={{ float: 'right' }}>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                showMonthYearDropdown
                            //showYearPicker
                            //dateFormat="yyyy"
                            />
                        </div>
                        <Row>
                            <Col sm="12" md={{ size: 8, offset: 3 }} style={well}>
                                <Bar
                                    data={barDet}
                                    options={{

                                        title: {
                                            display: true,
                                            text: 'Pulse Usage by Each User on ' + this.state.startDate.getDate() + '/' + (parseInt(this.state.startDate.getMonth()) + parseInt(1)) + '/' + this.state.startDate.getFullYear(),
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


const mapDispatchToProps = dispatch => {
    return {
        setTitle: (title) => { dispatch({ type: "SET_TITLE", title: title }) }
    }
}

export default connect(null, mapDispatchToProps)(UsersDayUsage)
