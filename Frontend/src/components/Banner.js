import React from "react";
import Cookies from "universal-cookie";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Pagination from 'react-bootstrap/Pagination';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import ErrorHandler from "./errorHandler/errorHandler";
import './Banner.css';
import cellEditFactory from 'react-bootstrap-table2-editor';

class Banner extends React.Component {
    constructor(props) {
        super(props);
        this.selectedBanner = {};
        this.state = {
            newBannerText: '',
            banners: [],
            show: false,
            loading: true,
            error: false,
            errorMsg: "",
            page: 1,
            sizePerPage: 10,
            totalSize: 0,

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
                    editable: false,
                },
                {
                    dataField: "text",
                    text: "Text",
                    sort: true,
                    headerStyle: {
                        backgroundColor: "#0b0b19",
                        color: "#ffffff",
                        textAlign: "center",
                    },
                    editable: true,
                },
                {
                    dataField: 'delete',
                    text: 'Delete',
                    formatter: this.deleteButtonFormatter,
                    headerStyle: {
                        backgroundColor: "#0b0b19",
                        color: "#ffffff",
                        textAlign: "center",
                    },
                    editable: false,
                },
            ],
            showUserUsage: false,
            showErrorDialog: false,
            errorMessage: "Please Login",

        };

    }

    deleteButtonFormatter = (cell, row) => {
        return (
            <button onClick={() => this.deleteBanner(row.id)}>
                Delete
            </button>
        );
    };

    fetchBannerDetails = async (page = 0) => {
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
            const response = await fetch(`http://localhost:8080/api/auth/banner/fetch?page=${page}`, requestOptions);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            } else {
                const data = await response.json();
                console.log("Banner data:", data); // Log the fetched data
                this.setState({ users: data.content, done: true, loading: false, currentPage: page, totalPages: data.totalPages });
            }
        } catch (error) {
            console.error("There was an error!", error);
            this.setState({ errorMessage: error.toString() });
        }
    };

    deleteBanner = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) {
            return; // If the user clicked Cancel, do nothing
        }
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
            const response = await fetch(`http://localhost:8080/api/auth/banner/delete/${id}`, requestOptions);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            } else {
                console.log("Banner deleted successfully"); // Log the success message
                this.fetchBannerDetails(this.state.currentPage); // Refresh the table
            }
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    handlePageChange = (pageNumber) => {
        this.fetchBannerDetails(pageNumber);
    };

    handleNewBannerTextChange = (event) => {
        this.setState({ newBannerText: event.target.value });
    };

    componentDidMount() {
        this.fetchBannerDetails(this.state.currentPage);
    }

    afterSaveCell = async (oldValue, newValue, row, column) => {
        console.log(`Edited cell in column "${column.dataField}" from "${oldValue}" to "${newValue}"`);
        // Create the updated banner object
        const updatedBanner = { ...row, [column.dataField]: newValue };

        const cookies = new Cookies();
        const token = cookies.get("token");
        // Send a request to the server to update the banner
        try {
            const response = await fetch('http://localhost:8080/api/auth/banner/update', {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-requested-with": "XMLHttpRequest",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedBanner),
            });

            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            } else {
                const data = await response.json();
                console.log('Success:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    addBanner = async (event) => {
        event.preventDefault(); // Prevent the form from being submitted normally
    
        const cookies = new Cookies();
        const token = cookies.get("token");
        const requestOptions = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-requested-with": "XMLHttpRequest",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify([{ text: this.state.newBannerText }]), // Send the new banner text in the request body
        };
    
        try {
            const response = await fetch(`http://localhost:8080/api/auth/banner/add`, requestOptions);
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            } else {
                console.log("Banner added successfully"); // Log the success message
                this.setState({ newBannerText: '' }); // Clear the input field
                this.fetchBannerDetails(this.state.currentPage); // Refresh the table
            }
        } catch (error) {
            console.error("There was an error!", error);
        }
    };

    checkUserLoginStatus = () => {
        const cookies = new Cookies();
        const token = cookies.get("token");
        return token;
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
                // this.showModal(row);
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

        const addBannerForm = (
            <form onSubmit={this.addBanner}>
                <input
                    type="text"
                    value={this.state.newBannerText}
                    onChange={this.handleNewBannerTextChange}
                    placeholder="New banner text"
                />
                <button type="submit">Add Banner</button>
            </form>
        );

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

        if (this.state.done) {
            return (
                <div className="BannersComponent">
                    {addBannerForm}
                    <div className="BannersTable">
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
                            cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell: this.afterSaveCell })}
                        // pagination={paginationFactory()}
                        ></BootstrapTable>
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
export default connect(mapStateToProps, mapDispatchToProps)(Banner);