import React from "react";
import Cookies from "universal-cookie";
import { Button, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Pagination from 'react-bootstrap/Pagination';
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Loader from "react-loader-spinner";
import "./Transactions.css";
import { connect } from "react-redux";
import ErrorHandler from "./errorHandler/errorHandler";
export class Transactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      transactions: {
        createdBy: "0",
        creationDate: "",
        lastModifiedBy: "0",
        lastModifiedDate: "",
        id: 162,
        userId: 18,
        tranDate: "",
        tranDrAmount: null,
        tranCrAmount: null,
        type: "cr",
        pulseCount: null,
        model_number: null,
        deleted: false,
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
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
          filter: textFilter(),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
          filter: textFilter(),
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
          dataField: "pulseCount",
          text: "Pulse Count",
          sort: true,
          headerStyle: {
            backgroundColor: "#0b0b19",
            color: "#ffffff",
            textAlign: "center",
          },
        },
        // {
        //   dataField: "model_number",
        //   text: "Model",
        //   filter: textFilter(),
        //   sort: true,
        //   headerStyle: {
        //     backgroundColor: "#0b0b19",
        //     color: "#ffffff",
        //     textAlign: "center",
        //   },
        //   formatter: modelFormatter
        // },
      ],
      done: false,
      showInfo: false,
      loading: true,
      showErrorDialog: false,
    };
    function rankFormatter(cell) {
      var date = new Date(cell);
      var res =
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      return <h6> {res} </h6>;
    }

    // function modelFormatter(cell, formatExtraData) {

    //   if (cell == null) {
    //     return <h6> TCM </h6>;
    //   } else if (cell == 1) {
    //     return <h6>TCM </h6>;
    //   } else if (cell == 2) {
    //     return <h6> EH </h6>;
    //   } else {
    //     return <h6> TCM & EH </h6>;
    //   }
    // }
  }

  hideModal = () => {
    this.setState({ showInfo: false });

  };

  fetchTransactions = async (page = 0) => {
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
    // fetch("https://basavahealing.org/api/trns/all", requestOptions)
    fetch(`http://localhost:8080/api/auth/transactions?page=${page}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        console.log("Transcation data:", data);
        if (!response.ok) {
          console.log("not ok");
        } else {
          this.setState({
            transactions: data.content,
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
    this.fetchTransactions(pageNumber);
  };



  componentDidMount() {
    this.props.setTitle("Transactions");  // Passing the title to the navbar
    const cookies = new Cookies();
    const token = cookies.get("token");

    token
      ? this.fetchTransactions()
      : this.setState({ showErrorDialog: true, loading: false });
  }

  showModal = (data) => {

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
      "https://basavahealing.org/api/users/by-id/" + data.userId,
      requestOptions
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          console.log("not ok");
        } else {
          this.setState({ user: data, showInfo: true });

        }
      })
      .catch((error) => {
        console.log("error caught");
        console.error("There was an error!", error);
      });
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
      },
    };
    const rowStyle2 = (row) => {
      const style = {};
      style.color =
        row.model_number > 2
          ? "#000000"
          : row.model_number > 1
            ? "#000000"
            : "#000000";
      style.whiteSpace = "nowrap";
      style.overflow = "hidden";
      style.textOverflow = "ellipsis";
      style.fontSize = "12px";
      //style.backgroundColor="#f3f3f3";
      style.backgroundColor = row.model_number > 2 ? '#f3f3f3' : row.model_number > 1 ? '#dddddd' : '#f3f3f3';
      return style;
    };

    const errorMsg = this.state.showErrorDialog ? (
      <ErrorHandler
        heading="Security Alert"
        body={"Please Login"}
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

    if (this.state.showInfo) {
      var res = this.state.user;
      const modelstyle = {
        width: "100%",
        height: "100%",
      };
      return (
        <Modal.Dialog
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {res.firstName} {res.lastName}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={modelstyle}>
            <p>
              <b>ID : </b>
              {res.id}
            </p>
            <p>
              <b>Email : </b>
              {res.username}
            </p>
            <p>
              <b>Mobile Number : </b>
              {res.mobileNumber}
            </p>
            <p>
              <b>Model : </b>
              {res.model_number > 2
                ? "TCM & EH"
                : res.model_number > 1
                  ? "EH"
                  : "TCM"}
            </p>
            <p>
              <b>Address : </b>
              {res.residencialAddress}
            </p>
            <p>
              <b>Active : </b>
              {res.active}
            </p>
            <p>
              <b>Enrolled Date : </b>
              {res.lastModifiedDate}
            </p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      );
    }
    if (this.state.done) {
      let transaction = (
        this.state.transactions.map(trans => {
          if (trans.pulseCount > 0) {
            //console.log(trans.pulseCount);
            return trans
          }
        })
      )

      //console.log(Array.isArray(transaction))

      //console.log(this.state.transactions)
      return (
        <div className="Transactions">
          <div className="TransactionsComponent">
            <div className="TransactionsTable">
              <BootstrapTable
                hover
                keyField="id"
                data={transaction}
                rowStyle={rowStyle2}
                columns={this.state.columns}
                rowEvents={rowEvents}
                filter={filterFactory()}
              // pagination={paginationFactory()}
              ></BootstrapTable>
              {paginationBasic}
            </div>
          </div>
        </div>
      );
    } else {
      return <h1>Hi </h1>;
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTitle: (title) => {
      dispatch({ type: "SET_TITLE", title: title });
    },
  };
};

export default connect(null, mapDispatchToProps)(Transactions);