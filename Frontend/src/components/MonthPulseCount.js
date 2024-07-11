import React from "react";

import Cookies from 'universal-cookie';
import { Line } from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import { Row, Col } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";

import './MonthPulseCount.css'

class MonthPulseCount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // res: {
            //     used: "1019",
            //     year: "2019",
            //     month: "1"
            // },
            res: [],
            startDate: new Date(),
            matches: window.matchMedia("(min-width: 768px)").matches,
            done: false
        };

    }

    fetchData = date => {
        var selectedMonth = date;//new Date().getFullYear();
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
        //console.log("date before fetch "+selectedMonth);
        fetch('http://localhost:8080/api/auth/totalPulseCountForMonth/' + selectedMonth, requestOptions)
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
                    console.log(this.state.res)
                    console.log(this.state.res.map(a => a.used))
                }


            })
            .catch(error => {
                //console.log("error caught");
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });

    }


    handleChange = date => {
        this.setState({
            startDate: date,
            done: false
        });
        // var selectedMonth=(date.getMonth()+1)+"/"+date.getFullYear();
        var selectedMonth = date.getFullYear() + "-" + (date.getMonth() + 1);
        this.fetchData(selectedMonth);
    };

    componentDidMount() {
        // var selectedMonth=(this.state.startDate.getMonth()+1)+"/"+this.state.startDate.getFullYear();
        var selectedMonth = this.state.startDate.getFullYear() + "-" + (this.state.startDate.getMonth() + 1);
        this.fetchData(selectedMonth);
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
            // this.state.datasets.data=this.state.res;
            // {this.state.res.map((data, key) => {
            const barDet = {
                // labels: this.state.res.map(b => b.year),
                labels: this.state.res.map(b => b[0]), 
                datasets: [
                    {
                        label: 'Pulse Usage',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: '#030976',
                        borderWidth: 2,
                        // data: this.state.res.map(a => a.used)
                        data: this.state.res.map(a => a[1])
                    }
                ]
            }
            if (!this.state.matches) {
                return (
                    <div className="MonthPulseCount">
                        <div className="MonthPulseCountDatePicker" >
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                minDate={new Date(2000, 1, 1)}
                                scrollableYearDropdown
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                            />
                        </div>
                        <div style={well}>
                            <Line className="MonthPulseCountBarChart"
                                data={barDet}
                                options={{
                                    title: {
                                        display: true,
                                        text: 'Pulse Usage in Each Day Of the Month ',
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
                    </div>
                    //)})};
                );

            } else {

                var mar = {
                    margin: "30px",
                    padding: "5px"
                }

                return (
                    <div style={mar} >
                        <div style={{ float: 'right' }}>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChange}
                                minDate={new Date(2000, 1, 1)}
                                scrollableYearDropdown
                                showMonthYearPicker
                                dateFormat="MM/yyyy"
                            />
                        </div>
                        <div >
                            <Row>
                                <Col sm="12" md={{ size: 8, offset: 3 }} style={well} >

                                    <Line
                                        data={barDet}
                                        options={{
                                            title: {
                                                display: true,
                                                text: 'Pulse Usage in Each Day Of the Month ',
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
                    </div>
                    //)})};
                );
            }

        } else {
            return (
                <div>
                    <h1>MonthPulseCount component Loading...</h1>
                </div>
            );
        }
    }
}

export default MonthPulseCount;