import React from "react";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";


// import Location from "./components/Location";
// import NewUsers from "./components/NewUsers";
// import UserRegStat from "./helpers/userRegStat/UserRegStat";
// import { About } from "./About";
import Home from "./Home";
import Banner from "./components/Banner";
import UsersComponent from './components/UsersComponent';
import userTransaction from './components/UsersComponent';
import Distributor from "./components/Distributor";
import { NoMatch } from "./NoMatch";
import { Device } from "./Device";
import Login from "./components/Login";
import SideBar from "./components/SideBar";
import { UserAnalytics } from "./components/UserAnalytics";
import Transactions from "./components/Transactions";
import { connect } from "react-redux";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          {window.matchMedia("(min-width: 768px)").matches && <SideBar />}
          <NavigationBar title={this.props.title}></NavigationBar>
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route path="/users" component={About} /> */}
            <Route path="/users" component={UsersComponent} /> {/* Use UsersComponent instead of About */}
            <Route path="/user/:id/transactions" component={userTransaction} /> {/* Use userTransaction instead of About */}
            <Route path="/login" component={Login} />
            <Route path="/devices" component={Device} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/pulseUsage" component={NoMatch} />
            <Route path="/distributors" component={Distributor} />
            <Route path="/usersUsage" component={UserAnalytics} />
            <Route path="/banners" component={Banner} />
            {/* <Route path="/location" component={Location} /> */}
            {/* <Route path="/NewUsers" component={NewUsers} />
            <Route path="/UserRegStat" component={UserRegStat} /> */}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.loggedIn,
    token: state.token,
    title: state.title,
  };
};

export default connect(mapStateToProps, null)(App);
//export default App;
