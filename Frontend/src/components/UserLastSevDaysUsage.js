import React from "react";
import { Row, Col } from 'reactstrap';

import Cookies from 'universal-cookie';
import { Bar } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';

class UserLastSevDaysUsage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            res: {
                name: "1019",
                pulseused: "2019",
                email: "1"
            },
            matches: window.matchMedia("(min-width: 768px)").matches,
            done: false
        };

    }

    componentDidMount() {
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

        // fetch('https://basavahealing.org/api/users/getUsageByLastWeek', requestOptions)
        fetch('http://localhost:8080/api/auth/chartDataWeek', requestOptions)
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    console.log("not ok");
                } else {
                    this.setState({ res: data.chartData, done: true });
                }
            })
            .catch(error => {
                console.log("error caught");
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });

        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 768px)").addListener(handler);
    }


    render() {

        var well = {
            boxShadow: "0px 0px 10px 10px #163939",
            overflow: 'auto'
        }
        var mar = {
            margin: "30px",
            padding: "5px",
            width: '1800px'
        }
        if (this.state.done) {
            const barDet = {
                // labels: this.state.res.map(a => a.email),
                labels: this.state.res.user,
                datasets: [
                    {
                        label: 'Usage by',
                        fill: false,
                        lineTension: 0.5,
                        strokeColor: "rgba(220,220,220,0.8)",
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        // data:this.state.res.map(a => a.pulseused)
                        data: this.state.res.pulse
                    }
                ]
            }

            if (!this.state.matches) {
                return (
                    <div>

                        <HorizontalBar
                            data={barDet}
                            options={{
                                title: {
                                    display: true,
                                    //scales: ChartScales,
                                    text: 'Pulse Usage by Each User on Last 7 Days ',
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
                            width={600} height={3000}

                        >
                        </HorizontalBar>
                    </div>
                    //)})};
                );

            } else {
                return (
                    <div style={mar}>
                        <Row>
                            <Col sm="12" md={{ size: 9, offset: 0 }} style={well}>

                                <Bar
                                    data={barDet}
                                    options={{
                                        title: {
                                            display: true,
                                            //scales: ChartScales,
                                            showLines: true,
                                            text: 'Pulse Usage by Each User on Last 7 Days ',
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
                                    width={600} height={200}

                                >
                                </Bar>
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

export default UserLastSevDaysUsage;