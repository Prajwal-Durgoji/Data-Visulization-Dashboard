import React from "react";

import "./userTransaction.css";
import Cookies from "universal-cookie";

class userTransaction extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   transactions: {
    //     createdBy: "0",
    //     creationDate: "",
    //     lastModifiedBy: "0",
    //     lastModifiedDate: "",
    //     id: 162,
    //     userId: 18,
    //     tranDate: "",
    //     tranDrAmount: null,
    //     tranCrAmount: null,
    //     type: "cr",
    //     pulseCount: null,
    //     model_number: null,
    //     deleted: false,
    //   },
    this.state = {
      transactions: [],
      done: false,
    };
  }

  componentDidMount() {
    const userId = this.props.userId;
    this.fetchTransactions(userId);
  }
    


  fetchTransactions = async (id) => {
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
    fetch(`http://localhost:8080/api/auth/transaction/details/${id}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.log("not ok");
        } else {
          this.setState({
            transactions: data,
            done: true,
            loading: false,
          });
          //console.log("res data :"+data)
        }
      })
      .catch((error) => {
        console.log("error caught");
        console.error("There was an error!", error);
      });
  }

  updatePulseCount = async (id) => {
    const newPulseCount = window.prompt("Enter the new pulse count");
    if (newPulseCount === null) return; // user clicked "cancel"

    const cookies = new Cookies();
    const token = cookies.get("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ pulseCount: parseInt(newPulseCount) }),
    };
    fetch(`http://localhost:8080/api/auth/transaction/update/${id}`, requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          console.log("Update not successful");
        } else {
          console.log("Update successful");
          this.fetchTransactions(this.props.userId); // refresh transactions
        }
      })
      .catch((error) => {
        console.log("error caught");
        console.error("There was an error!", error);
      });
  }



  render() {
    let rechData = null;
    if (this.state.done) {
      const transaction = this.state.transactions;
      rechData = (
        <tr key={transaction.creationDate}>
          <td>{transaction.id}</td>
          <td>{transaction.rechargeDate}</td>
          <td>{transaction.pulseCount}</td>

          <td>
            {transaction.model_number > 2
              ? "TCM & EH"
              : transaction.model_number > 1
              ? "EH"
              : "TCM"}
          </td>
          <td>
            <button onClick={() => this.updatePulseCount(transaction.id)}>
              Edit
            </button>
          </td>
        </tr>
      );
    }

    return (
      <div className="userTransactionTable">
        <div className="userTransactionTableHeading">
          <h2>Transactions</h2>
        </div>
        <table>
          <thead>
            <tr className="userTransactionTableRow">
              <th>User Id</th>
              <th>Recharged Date</th>
              <th>Pulse Count</th>
              <th>Model</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className="userTransactionTableBody">{rechData}</tbody>
        </table>
      </div>
    );
  }
}
export default userTransaction;
