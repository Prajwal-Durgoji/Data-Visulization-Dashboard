import React from "react";
import Cookies from "universal-cookie";
import "./NavigationBar.css";
import { Link } from "react-router-dom";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: "/",
      showMenubar: false,
      mobile: window.matchMedia("(min-width: 768px)").matches,

      items: [
        {
          path:
            "/" /* path is used as id to check which NavItem is active basically */,
          name: "Home",
          css: "fa fa-fw fa-home",
          active: false,
          key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
        },
        {
          path: "/users",
          name: "Users",
          css: "fa fa-users",
          active: false,
          key: 2,
        },
        {
          path: "/pulseUsage",
          name: "Pulse Usage",
          css: "fas fa-chart-line",
          active: false,
          key: 3,
        },
        {
          path: "/usersUsage",
          name: "User Usage",
          css: "fa fa-user-secret",
          active: false,
          key: 4,
        },
        {
          path: "/devices",
          name: "Device",
          css: "fa fa-mobile",
          active: false,
          key: 5,
        },
        {
          path: "/transactions",
          name: "Transactions",
          css: "fas fa-file-invoice-dollar",
          active: false,
          key: 6,
        },
        // {
        //   path: "/location",
        //   name: "Location",
        //   css: "fa fa-map-marker",
        //   active: false,
        //   key: 7,
        // },
        {
          path: "/distributors",
          name: "Distributor",
          css: "fas fa-file-invoice-dollar",
          active: false,
          key: 7,
        },
        {
          path: "/banners",
          name: "Banner",
          css: "fas fa-file-invoice-dollar",
          active: false,
          key: 8,
        },
      ],
    };
  }

  componentDidMount() {
    const handler = (e) => this.setState({ mobile: e.matches });
    window.matchMedia("(min-width: 768px)").addListener(handler);
  }

  showMenubarHandler = () => {
    this.state.showMenubar === true
      ? this.setState({ showMenubar: false })
      : this.setState({ showMenubar: true });
  };

  closeMenuBarHandler = (item) => {
    //console.log(item,this.state.items[item.key-1])
    var updateItems = [...this.state.items];
    for (let uItem in updateItems) {
      updateItems[uItem].active = false;
    }
    updateItems[item.key - 1].active = true;
    this.setState({ showMenubar: false, active: true, items: updateItems });
  };

  render() {
    const menuBar = (
      <div className="MenuBar">
        {this.state.items.map((item) => {
          //console.log(item.name,"MenuBarRow"+item.active)

          return (
            <Link
              to={item.path}
              active={item.name}
              key={item.name}
              className={"MenuBarRow" + item.active}
              onClick={() => {
                this.closeMenuBarHandler(item);
              }}
            >
              {item.name}{" "}
            </Link>
          );
        })}
      </div>
    );
    //console.log(this.state.showMenubar);
    var icon = "";
    if (this.state.mobile) {
      icon = <div></div>;
    } else {
      icon = (
        <div className="MenuBarIcon">
          <i
            className={
              this.state.showMenubar === true ? "fa fa-times" : "fa fa-bars"
            }
            onClick={this.showMenubarHandler}
          ></i>
        </div>
      );
    }

    return (
      <div className="NavigationBar">
        {this.state.showMenubar && menuBar}
        {icon}
        <div className="Navtitle">
          <h2>{this.props.title}</h2>
        </div>

        <div className="LoginBtn">
          <a href="/Login">
            {" "}
            {new Cookies().get("token") ? "Logout" : "Login"}
          </a>
        </div>
      </div>
    );
  }
}

export default NavigationBar;
