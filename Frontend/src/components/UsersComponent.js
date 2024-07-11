import React from "react";
import Cookies from "universal-cookie";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
// import paginationFactory from "react-bootstrap-table2-paginator";
import Pagination from 'react-bootstrap/Pagination';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./UsersComponent.css";
import { connect } from "react-redux";
import ErrorHandler from "./errorHandler/errorHandler";
import UserDashboard from "../container/userDashboard";

class UsersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.selectedUser = {};
    this.textInput = React.createRef();
    this.state = {
      currentPage: 0,
      totalPages: 0,
      users: {
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
        phoneNumber: "",
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
      show: false,
      loading: true,
      resp: {
        used: "1019",
        year: "2019",
        month: "1",
      },

      columns: [
        {
          dataField: "id",
          text: "ID",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "email",
          text: "Email",
          filter: textFilter(),
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "name",
          text: "User Name",
          filter: textFilter(),
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "phoneNumber",
          text: "Phone Number",
          filter: textFilter(),
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "distributor",
          text: "Distributor",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "gender",
          text: "Gender",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "houseNo",
          text: "House No",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "landMark",
          text: "Land Mark",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "pinCode",
          text: "PinCode",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "country",
          text: "Country",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "state",
          text: "State",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "dateCreated",
          text: "Date Created",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
          formatter: rankFormatter,
        },
        {
          dataField: "pulseCount",
          text: "Pulse Count",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "rechargeDate",
          text: "Recharge Date",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
          formatter: rankFormatter,
        },
        {
          dataField: "macid",
          text: "Mac Id",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        {
          dataField: "activatedDate",
          text: "Activated Date",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
          formatter: rankFormatter,
        },
        {
          dataField: 'delete',
          text: 'Delete',
          formatter: (cell, row) => {
            return (
              <button onClick={(event) => this.handleDelete(row.id, event)}>Delete</button>
            );
          },
          headerStyle: {
            backgroundColor: '#0b0b19',
            color: '#ffffff',
            textAlign: 'center',
          },
        }
      ],

      showUserUsage: false,
      showErrorDialog: false,
      errorMessage: "Please Login",
    };

    function rankFormatter(cell) {
      var date = new Date(cell);
      var res =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return <h6> {res} </h6>;
    }
  }

  

  fetchUserDetails = async (page = 0) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`http://localhost:8080/api/auth/userList?page=${page}`, requestOptions);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      } else {
        const data = await response.json();
        console.log("User data:", data); // Log the fetched data
        this.setState({ users: data.content, done: true, loading: false, currentPage: page, totalPages: data.totalPages });
      }
    } catch (error) {
      console.error("There was an error!", error);
      this.setState({ errorMessage: error.toString() });
    }
  };

  handlePageChange = (pageNumber) => {
    this.fetchUserDetails(pageNumber);
  };

  handleDelete = async (id, event) => {
    event.stopPropagation();
    // Show a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) {
      return;
    }

    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`http://localhost:8080/api/auth/deleteUser/${id}`, requestOptions);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      } else {
        alert('User deleted successfully');
        this.fetchUserDetails(); // Refresh the user list
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  checkUserLoginStatus = () => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    return token;
  };

  componentDidMount() {
    this.fetchUserDetails(this.state.currentPage);
  }

  showModal = (data) => {
    console.log('Selected user:', data);
    this.selectedUser = data;
    this.props.history.push(`/user/${data.id}/transactions`);
    this.setState({
      show: true,
      selectedEmail: data.email,
      selectedName: data.name,
      selectedPhone: data.phoneNumber,
      selectedAddress: data.address,
      selectedLandMark: data.landMark,
      selectedPinCode: data.pinCode,
      selectedCountry: data.country,
      selectedState: data.state,
      selectedCity: data.city,
      selectedHouseNo: data.houseNo,
      selectedMacid: data.macid,
      selectedActivatedDate: data.activatedDate,
      selectedMacid: data.macid,
      selectedActivatedDate: data.activatedDate,
    }, () => console.log('Selected email:', this.state.selectedEmail));
  };

  hideModal = () => {
    this.setState({ show: false });
    //console.log('hide modal');
  };

  editForm = () => {
    console.log("Edit Form");
  };

  hideUsageModal = () => {
    this.setState({ showUserUsage: false });
    //console.log('hide Usage modal');
  };

  fetchDetails = () => {
    //console.log('We need to get the details for ', data);
  };

  render() {
    let active = this.state.currentPage + 1;
    let items = [];
    for (let number = 1; number <= this.state.totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={() => this.handlePageChange(number - 1)}>
          {number}
        </Pagination.Item>,
      );
    }

    const paginationBasic = (
      <div className="center-pagination">
        <Pagination>{items}</Pagination>
      </div>
    );

    const rowEvents = {
      onClick: (e, row) => {
        this.showModal(row);
        //console.log("one click");
      },
      onDoubleClick: () => {
        //console.log("Double click");
      },
    };

    const rowStyle2 = (row) => {
      const style = {};
      //style.color = "#000000";

      style.color =
        row.model_number > 2
          ? "#009879"
          : row.model_number > 1
            ? "#ff581a"
            : "#000000";

      style.whiteSpace = "nowrap";
      style.overflow = "hidden";
      style.textOverflow = "ellipsis";
      style.backgroundColor = "#f3f3f3";
      return style;
    };

    const errorMsg = this.state.showErrorDialog ? (
      <ErrorHandler
        heading="Security Alert"
        body={this.state.errorMessage}
        gotoLogin={true}
      ></ErrorHandler>
    ) : null;

    if (this.state.showErrorDialog) {
      return errorMsg;
    }

    if (this.state.loading) {
      return (
        <Loader
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-40%, -40%)",
          }}
          type="Grid"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={7000} //7 secs
        />
      );
    }

    if (this.state.showUserUsage) {
      return <UserDashboard></UserDashboard>;
    }

    if (this.state.show) {
      return (
        <UserDashboard
          userId={this.selectedUser.id}
          email={this.state.selectedEmail}
          name={this.state.selectedName}
          houseNo={this.state.selectedHouseNo}
          phoneNumber={this.state.selectedPhone}
          landMark={this.state.selectedLandMark}
          address={this.state.selectedAddress}
          pinCode={this.state.selectedPinCode}
          country={this.state.selectedCountry}
          state={this.state.selectedState}
          city={this.state.selectedCity}
          active={this.selectedUser.active}
          macid={this.state.selectedMacid}
          activatedDate={this.state.selectedActivatedDate}
          model_number={
            this.selectedUser.model_number > 2
              ? "TCM & EH"
              : this.selectedUser.model_number > 1
                ? "EH"
                : "TCM"
          }
        ></UserDashboard>
      );
    }

    if (this.state.done) {
      return (
        <div className="UsersComponent">
          <div className="UsersTable">
            <BootstrapTable
              responsive
              striped
              hover
              keyField="id"
              data={this.state.users}
              rowStyle={rowStyle2}
              columns={this.state.columns}
              rowEvents={rowEvents}
              filter={filterFactory()}
            // pagination={paginationFactory()}
            ></BootstrapTable>
            {/* <div className="pagination-controls">
              <button onClick={() => this.handlePageChange(this.state.currentPage - 1)} disabled={this.state.currentPage === 0}>Previous</button>
              <span>Page {this.state.currentPage + 1}</span>
              <button onClick={() => this.handlePageChange(this.state.currentPage + 1)} disabled={this.state.currentPage + 1 >= this.state.totalPages}>Next</button>
            </div> */}
            {paginationBasic}
          </div>
        </div>
      );
    } else {
      return <h1>Loading... </h1>;
    }
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
    setTitle: (title) => {
      dispatch({ type: "SET_TITLE", title: title });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersComponent);
