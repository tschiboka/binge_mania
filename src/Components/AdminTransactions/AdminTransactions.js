import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./AdminTransactions.scss";



export default class AdminTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            isLoading: true,
            showInfoOfLine: 1,
            showPagination: false // show pagination only when all of the transactions has been downloaded
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



    renderTransactions() {
        console.log(this.state.transactions);
        return this.state.transactions.map((tr, i) => (
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
                        <tr><th></th><th>Date</th><th>User ID</th><th>Email</th><th>Amount</th></tr>
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