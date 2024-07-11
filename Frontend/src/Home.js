
import React from "react";
import styled from "styled-components";
import "./Home.css";
import { connect } from "react-redux";
import Typewriter from "typewriter-effect";

const GridWrapper = styled.div`
  margin-top: 0em;
  margin-left: 4em;
`;

const MGridWrapper = styled.div`
  grid-gap: 10px;
  margin-top: 0em;
  margin-left: 0em;
`;

class Home extends React.Component {
  componentDidMount() {
    this.props.setTitle("Home");
  }

  render() {
    // this.props.setTitle("Home");
    var Wrapper =
      window.matchMedia("(min-width: 768px)").matches === true
        ? GridWrapper
        : MGridWrapper;

    return (
      <Wrapper>
        <header className="App-header">
          <div className="HomeContent">
            <img
              src={process.env.PUBLIC_URL + "/NadifitLogo.png"}
              className="App-logo"
              alt="logo"
            />

            <Typewriter
              options={{
                strings: [
                  "Unique Pulse Diagnosis Device",
                  "Provides Physical, Mental and Emotional Health status",
                  "Suggest Natural and Effective Treatments",
                ],
                autoStart: true,
                loop: true,
              }}
            />

            {/* <p>Unique Pulse Diagnosis Device</p> */}
            <a
              className="App-link"
              href="https://nadifithub.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.nadifithub.com
            </a>
          </div>
        </header>
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTitle: (title) => {
      dispatch({ type: "SET_TITLE", title: title });
    },
  };
};

export default connect(null, mapDispatchToProps)(Home);
