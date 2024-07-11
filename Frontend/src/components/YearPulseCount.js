import React from "react";
import Cookies from 'universal-cookie';
import { Line } from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import { Row, Col } from 'reactstrap';

import "react-datepicker/dist/react-datepicker.css";
import './YearPulseCount.css'

class YearPulseCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // res: {
            //     used: "1019",
            //     year: "2019",
            //     month: "1"
            // },
            res: {},
            startDate: new Date().getFullYear(),
            matches: window.matchMedia("(min-width: 768px)").matches,
            done: false
        };

    }

    fetchData = date => {
        var year = date;//new Date().getFullYear();
        //console.log("Did Mount::"+year);
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
        //console.log("date before fetch "+year);
        this.setState({ year: year });
        fetch('http://localhost:8080/api/auth/totalPulseCountForYear/' + year, requestOptions)
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
                } else {
                    this.setState({ res: data, done: true });
                    //console.log(this.state.res)
                    //console.log(this.state.res.map(a => a.used))
                }
            })
            .catch(error => {
                console.log("error caught");
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }


    handleChange = date => {
        this.setState({
            // startDate: date.getFullYear(),
            startDate: date,
            done: false

        });
        //console.log("Modified Date is:"+date.getFullYear())
        this.fetchData(date.getFullYear());
    };

    componentDidMount() {
        this.fetchData(this.state.startDate);
        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 768px)").addListener(handler);
    }

    render() {
        var well = {
            backgroundColor: "#f3f3f3",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 10px #02075d"
        }
        //console.log("before ren"+this.state.startDate);
        if (this.state.done) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            // var mapped = this.state.res.map(b => months[b.month - 1])
            const barDet = {
                labels: Object.keys(this.state.res).map(month => months[month - 1]), // map month numbers to month names
                datasets: [
                    {
                        label: 'Pulse Usage',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: '#030976',
                        borderWidth: 2,
                        data: Object.values(this.state.res) // get pulse counts
                    }
                ]
            }

            if (!this.state.matches) {
                return (
                    <div className="YearPulseCount" style={well}>
                        <div className="YearPulseCountDatePicker" style={{ float: 'right' }}>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                //minDate={new Date(2000,1,1)}
                                showYearPicker
                                dateFormat="yyyy"
                            />
                        </div>
                        <Line
                            data={barDet}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,

                                title: {
                                    display: true,
                                    text: 'Pulse Usage in Each Month Of the Year ' + this.state.year,
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
                        ></Line>
                    </div>
                );
            } else {
                var mar = {
                    margin: "30px",
                    padding: "5px"
                }
                return (
                    <div style={mar}>
                        <div style={{ float: 'right' }}>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                //minDate={new Date(2000,1,1)}
                                showYearPicker
                                dateFormat="yyyy"
                            />
                        </div>
                        <Row>
                            <Col sm="12" md={{ size: 8, offset: 3 }} style={well}>
                                <Line
                                    data={barDet}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        title: {
                                            display: true,
                                            text: 'Pulse Usage in Each Month Of the Year ' + this.state.year,
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
                                ></Line>
                            </Col>
                        </Row>
                    </div>
                );
            }
        } else {
            return (
                <div>
                    <h1>YearPulseCount component Loading...</h1>
                </div>
            );
        }
    }
}
export default YearPulseCount;