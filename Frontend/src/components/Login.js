import React from "react";
import "./Login.css";
import { Modal } from "react-bootstrap";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import ErrorHandler from "./errorHandler/errorHandler";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",

      users: {
        app: {},
        user: {
          createdBy: "",
          creationDate: "",
          lastModifiedBy: "",
          lastModifiedDate: "",
          id: "",
          username: "U",
          roles: [
            {
              role: "",
            },
            {
              role: "",
            },
          ],
          latitude: "",
          logitude: "",
          firstName: "A",
          lastName: "B",
          active: "",
          confirmationToken: "",
          mobileNumber: "",
          officeAddress: "",
          residencialAddress: "",
          tMac: "",
          dMac: "",
          resetToken: "",
          apkVersion: "",
          isEnrolled: true,
          model_number: "",
          deleted: "",
        },
        token: "",
        refreshToken: "",
      },
      done: false,
      showErrorDialog: false,
      errorMessage: "Please Check username and password",
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }
  
  handleSubmit(event) {
    if (this.state.email === "" || this.state.password === "") {
      this.setState({ showErrorDialog: true });
    } else {
      event.preventDefault();
  
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-requested-with": "XMLHttpRequest",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      };
  
      fetch("http://localhost:8080/api/auth/login", requestOptions)
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json();
            const error = (data && data.message) || response.status;
            throw new Error(error);
          }
  
          const data = await response.json();
          const { token } = data;
  
          // Store token in cookies
          const cookies = new Cookies();
          cookies.set("token", token, {
            path: "/",
            expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiration
          });
  
          // Dispatch action to save token in Redux store
          this.props.saveToken(true, token);
  
          // Redirect user to home page
          this.props.history.push("/");
        })
        .catch((error) => {
          console.error("Login failed:", error);
          this.setState({
            showErrorDialog: true,
            errorMessage: error.message || "Failed to login",
          });
        });
    }
  }
  

  setErrorHandlerFalse = () => {
    this.setState({ showErrorDialog: false });
  };

  componentDidMount() {
    this.props.setTitle("Login");
  }

  render() {
    
    const loginDialog = (
      <div className="Login">
        <Modal.Dialog
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title>
              <b> Login</b>{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <input
                autoFocus
                autoComplete="on"
                className="Email"
                placeholder="UserName"
                type="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              ></input>
              <input
                className="Password"
                placeholder="Password"
                type="password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              ></input>
              <button className="LoginSubmit" type="submit">Login</button>
            </form>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    );
    const retData = this.state.showErrorDialog ? (
      <ErrorHandler
        heading="Failed to Login"
        body={this.state.errorMessage}
        cancel={true}
        remove={this.setErrorHandlerFalse}
      ></ErrorHandler>
    ) : (
      loginDialog
    );
    return retData;
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.loggedIn,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveToken: (login, token) => {
      dispatch({ type: "SET_LOGIN_STATE", login: login, token: token });
    },
    setTitle: (title) => {
      dispatch({ type: "SET_TITLE", title: title });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
