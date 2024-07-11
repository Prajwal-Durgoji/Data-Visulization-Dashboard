import React from "react";
import Cookies from "universal-cookie";
// import { Button, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory from "react-bootstrap-table2-paginator";
import Pagination from 'react-bootstrap/Pagination';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Loader from "react-loader-spinner";
import "./Distributor.css";
import { connect } from "react-redux";
import ErrorHandler from "./errorHandler/errorHandler";
import DistributorDashboard from "../container/DistributorDashboard";

export class Distributor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      totalPages: 0,
      distributors: {
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
      columns: [
        {
          dataField: "id",
          text: "id",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },

        },
        {
          dataField: "name",
          text: "Name",
          filter: textFilter(),
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
          dataField: 'delete',
          text: 'Delete',
          formatter: (cell, row) => {
            return (
              <button onClick={(event) => this.handleDelete(row.id, event)}>
                Delete
              </button>
            );
          },
          headerStyle: {
            backgroundColor: '#0b0b19',
            color: '#ffffff',
            textAlign: 'center',
          },
        }
      ],
      done: false,
      showUserUsage: false,
      loading: true,
      showErrorDialog: false,
    };

    function rankFormatter(cell) {
      var date = new Date(cell);
      var res =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return <h6> {res} </h6>;
    }
  }

  hideModal = () => {
    this.setState({ showInfo: false });
  };

  fetchDistributors = async (page = 0) => {
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
    fetch(`http://localhost:8080/api/auth/distributorList?page=${page}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log("Distributor data:", data);
        if (!response.ok) {
          console.log("not ok");
        } else {
          this.setState({
            distributors: data.content,
            done: true,
            loading: false,
            currentPage: page,
            totalPages: data.totalPages,
          });
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        this.setState({ errorMessage: error.toString() });
      });
  };


  handlePageChange = (pageNumber) => {
    this.fetchDistributors(pageNumber);
  };

  
  handleDelete = async (id, event) => {
    event.stopPropagation();
    // Show a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this distributor?');
    if (!confirmDelete) {
      // If the user clicked Cancel, stop here and don't delete the user
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
      const response = await fetch(`http://localhost:8080/api/auth/deleteDistributor/${id}`, requestOptions);
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      } else {
        alert('Distributor deleted successfully');
        this.fetchDistributors(); // Refresh the user list
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
    this.props.setTitle("Distributors");
    this.fetchDistributors(this.state.currentPage);
  }

  showModal = (data) => {
    this.selectedDistributor = data;
    this.setState({
      show: true,
      selectedEmail: data.email,
      selectedName: data.name,
      selectedPhone: data.phoneNumber,
      selectedCountry: data.country,
      selectedState: data.state,
      selectedCity: data.city,
    }, () => console.log('Selected email:', this.state.selectedEmail));
  };


  hideModal = () => {
    this.setState({ show: false });
    //console.log('hide modal');
  };


  hideUsageModal = () => {
    this.setState({ showUserUsage: false });
    //console.log('hide Usage modal');
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
      return <DistributorDashboard></DistributorDashboard>;
    }

    if(this.state.show){
      return(
        <DistributorDashboard
          distributorId={this.selectedDistributor.id}
          email={this.selectedDistributor.email}
          name={this.selectedDistributor.name}
          phoneNumber={this.selectedDistributor.phoneNumber}
          country={this.selectedDistributor.country}
          state={this.selectedDistributor.state}
          city={this.selectedDistributor.city}
        ></DistributorDashboard>
      )
    }
    
    if (this.state.done) {
      return (
        <div className="DistributorComponent">
          <div className="DistributorsTable">
            <BootstrapTable
              responsive
              striped
              hover
              keyField="id"
              data={this.state.distributors}
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

export default connect(mapStateToProps, mapDispatchToProps)(Distributor);



