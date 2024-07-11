import React from "react";

import Cookies from 'universal-cookie';
import styled from 'styled-components';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Loader from 'react-loader-spinner'
import './DayPulseCount.css'
import { connect } from 'react-redux';

const TabWrapper = styled.div`
margin-top: 1em;
margin-left: 3em;
`;

class DayPulseCount extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      startDate: new Date(),
      //matches: window.matchMedia("(min-width: 768px)").matches,
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
    console.log("Modified Date is:"+date)
    this.fetchData(date);
  };


  fetchData = date => {
    // var selectedDate = date.getFullYear() + '-' + (parseInt(date.getMonth()) + parseInt(1)) + '-' + date.getDate();
    var selectedDate = date.toISOString().split('T')[0];
    console.log("date :::::: "+selectedDate);
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
    fetch('http://localhost:8080/api/auth/getPulseCountByDate/' + selectedDate, requestOptions)
      .then(async response => {
        const data = await response.json();
        //console.log("Day pulse count"+data); 
        // check for error response
        if (!response.ok) {
          console.log("not ok");
          this.setState({ count: 0, done: true, loading: false });
          // get error message from body or default to response status
          //const error = (data && data.message) || response.status;
          //console.error(error);
          //this.setState({ users: 'asd', done: false });
        } else {
          console.log("After fetch operation:::"+data)
          //data=10;
          this.setState({ count: data, done: true, loading: false });
          console.log(data)
        }
      })
      .catch(error => {
        console.log("error caught");
        this.setState({ errorMessage: error.toString() });
        console.error('There was an error!', error);
      });

  }

  componentDidMount() {
    this.props.setTitle("PulseCount");
    this.fetchData(this.state.startDate);
    //const handler = e => this.setState({matches: e.matches});
    //window.matchMedia("(min-width: 768px)").addListener(handler);
  }


  render() {
    //console.log("this.state.matches "+this.state.matches);
    //alert("this.state.matches "+this.state.matches);
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
      //var selDate=this.state.startDate.getFullYear()+'-'+(parseInt(this.state.startDate.getMonth()) + parseInt(1)) +'-'+this.state.startDate.getDate()
      //selDate=selDate.toString();
      //this.state.startDate.getDate().toString();
      //console.log("Render:::::"+ selDate);
      return (
        <TabWrapper>
          <div className="DayPulseCountContent"></div>
          <div className="DayPulseCountDatePicker">
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
            />
          </div>

          <div className="CircularProgressBar">
            <CircularProgressbar value={this.state.count} maxValue={50} text={this.state.count} />
          </div>
        </TabWrapper>
      );
    } else {
      return (
        <TabWrapper>
          <h1>DayPulseCount component Loading...</h1>
        </TabWrapper>
      );
    }

  }
}

const mapDispatchToProps = dispatch => {
  return {
    setTitle: (title) => { dispatch({ type: "SET_TITLE", title: title }) }
  }
}

export default connect(null, mapDispatchToProps)(DayPulseCount)