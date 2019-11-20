import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./AdminTransactions.scss";
import _ from "lodash";



export default class AdminTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            page: 1,
            isLoading: true,
            showInfoOfLine: 1,
            showPagination: false, // show pagination only when all of the transactions has been downloaded
            sortBy: "default",
            ascending: false,
            filterBy: ""
        };
    }



    async componentDidMount() {
        // load first 10 transactions (transactions size may grow really large)
        const trnsResp = await fetch("/api/transactions/10/1");
        const trnsJSON = await trnsResp.json();
        this.setState({ ...this.state, transactions: trnsJSON.reverse(), isLoading: false });

        // load the rest of the transactions
        const allTrnsResp = await fetch("/api/transactions");
        const allTrnsJSON = await allTrnsResp.json();
        this.setState({ ...this.state, transactions: allTrnsJSON.reverse(), showPagination: true });
    }



    formatDate(dt, d = new Date(dt)) {
        const add0 = n => n < 10 ? "0" + n : n;
        const date = `${d.getDate()}.${d.getMonth()}.${(d.getFullYear() + "").replace(/^\d{2}/g, "'")}`;
        const time = `${add0(d.getHours())}:${add0(d.getMinutes())}`;
        return date + " " + time;
    }



    sortTable(sortBy) {
        if (this.state.sortBy === sortBy) return this.setState({ ...this.state, ascending: !this.state.ascending, transactions: this.state.transactions.reverse() });

        let transArr = [];

        switch (sortBy) {
            case "user-id": {
                transArr = this.state.transactions.sort((a, b) => a.user.id.localeCompare(b.user.id));
                break;
            }
            case "email": {
                transArr = this.state.transactions.sort((a, b) => a.user.email.localeCompare(b.user.email));
                break;
            }
            case "amount": {
                transArr = this.state.transactions.sort((a, b) => a.transTotal - b.transTotal);
                break;
            }
            default: {
                transArr = this.state.transactions.sort((a, b) => new Date(a.date) - new Date(b.date))
            }
        }

        if (!this.state.ascending) transArr = transArr.reverse();

        this.setState({ ...this.state, sortBy: sortBy, transactions: transArr });
    }



    addSortArrow(sortBy) {
        if (this.state.sortBy === sortBy) {
            if (this.state.ascending) return <span>&#x2191;</span>
            else return <span>&#x2193;</span>
        }
        else return <span>&nbsp;</span>
    }



    renderTransactions() {
        if (!this.state.transactions.length) return;

        return _.chunk(this.state.transactions, 10)[this.state.page - 1].map((tr, i) => (
            <tr key={"admin-transaction" + i}
                className={this.state.showInfoOfLine - 1 === i ? "active" : ""}>
                <td>{this.state.showInfoOfLine - 1 === i ? <span>&#9658;</span> : ""}</td>

                <td>{this.formatDate(tr.date)}</td>

                <td>{tr.user.id}</td>

                <td>{tr.user.email}</td>

                <td>{tr.transTotal.toFixed(2)}</td>
            </tr>
        ));
    }



    render() {
        return (
            <div className="AdminTransactions">
                <div className="AdminTransactions__header">
                    <form>
                        <div className="AdminTransactions__filter-by">
                            <input type="text" />

                            <button>&#9660;</button>

                            <button>Filter</button>
                        </div>
                        <button>Search</button>
                    </form>

                    {this.state.showPagination && <div className="AdminTransactions__pagination">
                        <button>&#9668;</button>

                        <input type="text" placeholder="1" />

                        <span>of 19</span>

                        <button>&#9658;</button>

                        <button>&#x27f3;</button>
                    </div>}
                </div>

                <div className="AdminTransactions__body">
                    <table><tbody>
                        <tr>
                            <th></th> {/* Placeholder for active line arrow*/}

                            <th onClick={() => this.sortTable("default")}><span>Date</span>{this.addSortArrow("default")}</th>

                            <th onClick={() => this.sortTable("user-id")}><span>User ID</span>{this.addSortArrow("user-id")}</th>

                            <th onClick={() => this.sortTable("email")}><span>Email</span>{this.addSortArrow("email")}</th>

                            <th onClick={() => this.sortTable("amount")}><span>Amount</span>{this.addSortArrow("amount")}</th>
                        </tr>
                        {this.renderTransactions()}
                    </tbody></table>


                    <div className="AdminTransactions__complete-line-info">
                        Complete Line Info
                    </div>

                    <LoadingSpinner isLoading={this.state.isLoading} />
                </div>
            </div>
        );
    }
}