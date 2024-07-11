import React from 'react';

import styled from "styled-components";
import { Link } from "react-router-dom";


/* This defines the actual bar going down the screen */
const StyledSideNav = styled.div`
  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 75px;     /* Set the width of the sidebar */
  z-index: 1;      /* Stay on top of everything */
  top: 3.4em;      /* Stay at the top */
  background-color: #0b0b16; /* Black */
  overflow-x: hidden;     /* Disable horizontal scroll */
  padding-top: 10px;
  margin-top:10px;
`;



class SideNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          activePath: '/',
          items: [
            {
              path: '/', /* path is used as id to check which NavItem is active basically */
              name: 'Home',
              css: 'fa fa-fw fa-home',
              key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
            },
            {
              path: '/users',
              name: 'About',
              css: 'fa fa-users',
              key: 2
            },
            {
              path: '/pulseUsage',
              name: 'pulseUsage',
              css: 'fas fa-chart-line',
              key: 3
            },
            {
              path: '/usersUsage',
              name: 'UserAnalytics',
              css: 'fa fa-user-secret',
              key: 4
            },
            {
              path: '/transactions',
              name: 'Transactions',
              css: 'fas fa-file-invoice-dollar',
              key: 5
            },
            {
              path: '/distributors',
              name: 'Distributor',
              css: 'fas fa-file-invoice-dollar',
              key: 6
            },
            {
              path: '/banners',
              name: 'Banner',
              css: 'fas fa-file-invoice-dollar',
              key: 7
            },
            // {
            //   path: '/devices',
            //   name: 'Device',
            //   css: 'fa fa-mobile',
            //   key: 5
            // },
            // {
            //   path: '/location',
            //   name: 'Location',
            //   css: 'fa fa-map-marker',
            //   key: 7
            // },
            // {
            //   path: '/newUsers',
            //   name: 'newUsers',
            //   css: 'fa fa-user-plus',
            //   key: 8
            // },
            // {
            //   path: '/UserRegStat',
            //   name: 'UserRegStat',
            //   css: 'fa fa-registered',
            //   key: 9
            // },
          ]
        }  
      }

      onItemClick = (path) => {
        this.setState({ activePath: path }); /* Sets activePath which causes rerender which causes CSS to change */
      }

    render() {
        const { items, activePath } = this.state;
        return (
            <StyledSideNav>
            {
                
                items.map((item) => {
              
                return (
                    <NavItem
                      path={item.path}
                      name={item.name}
                      css={item.css}
                      onItemClick={this.onItemClick}
                      
                      active={item.path === activePath}
                      key={item.key}
                    />
                    //<div></div>
                )
                })
            }
            </StyledSideNav>
            //<div></div>
        );
    }
}


const StyledNavItem = styled.div`
  height: 70px;
  width: 75px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-bottom: 0;   /* Puts space between NavItems */
  background-color:#0b0b16;
  a {
    font-size: ${(props) => props.active ?  "1.6em":"1.9em"};
    color: ${(props) => props.active ? "white" : "#9FFFCB"};
    padding:8px;
    width:1.8em;
    height:1.5em;
    border-radius:15px;
    box-shadow: ${(props) => props.active ? "-3px -3px 7px #414661 inset, 3px 3px 7px #414661 inset" : "-3px -3px 7px #5a5b61, 3px 3px 7px #5a5b61"};
    
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }  
  }
`;


class NavItem extends React.Component {
    handleClick = () => {
        const { path, onItemClick } = this.props;
        onItemClick(path);
    }

    render() {
        const { active } = this.props;
      return (
        <StyledNavItem active={active}>
            <Link to={this.props.path} className={this.props.css} onClick={this.handleClick}></Link>
        </StyledNavItem>
      );
    }
  }


export default class SideBar extends React.Component {
  render() {
    return (
        <SideNav></SideNav>
        
    );
  }
}