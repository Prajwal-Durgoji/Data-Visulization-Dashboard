import React from "react";
import Cookies from "universal-cookie";
import { Line } from "react-chartjs-2";
import "./userMonthlyUsage.css";
class userMonthlyUsage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resp: {
        used: "1019",
        year: "2019",
        month: "1",
      },
      showUserUsage: false,
      matches: window.matchMedia("(min-width: 768px)").matches,
    };
  }

  fetchUserMonthUsage = () => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        authorization: "Bearer " + token,
      },
    };
    fetch(
      "https://basavahealing.org/api/getMonthUsageById/" + this.props.userId, // this.props.userId,
      requestOptions
    )
      .then(async (response) => {
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
          this.setState({ resp: data, showUserUsage: true });
          //console.log(data[0]);
        }
      })
      .catch((error) => {
        console.log("error caught");
        this.setState({ errorMessage: error.toString() });
        console.error("There was an error!", error);
      });
  };

  componentDidMount() {
    this.fetchUserMonthUsage();
    const handler = (e) => this.setState({ matches: e.matches });
    window.matchMedia("(min-width: 768px)").addListener(handler);
  }
  render() {
    let content = null;
    var sum=0;
    
    if (this.state.showUserUsage) {
      //console.log(this.state.resp);
      this.state.resp.map(a =>{
        sum=sum+parseInt(a.used);
      })
  
    const barDet = {
        labels: this.state.resp.map((a) => a.month + "/" + a.year),
        datasets: [
          {
            label: "Total Pulse Usage : "+sum,
            fill: false,
            lineTension: 0.5,
            // backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(255,255,255,1)",
            borderWidth: 2,
            data: this.state.resp.map((a) => a.used),
          },
        ],
      };

      if (!this.state.matches) {
        content = (
          <Line
            data={barDet}
            options={{
              title: {
                display: true,
                text: "Pulse Usage in Each Month ",
                fontSize: 30,
              },
              legend: {
                display: true,
                position: "top",
              },
            }}
            width={600}
            height={600}
          />
        );
      } else {
        content = (
          <Line
            data={barDet}
            options={{
              title: {
                display: true,
                text: "Pulse Usage in Each Month ",
                fontSize: 30,
              },
              legend: {
                display: true,
                position: "top",
              },
            }}
          />
        );
      }
    }
    return <div className="userMonthlyUsage">{content}</div>;
  }
}

export default userMonthlyUsage;
