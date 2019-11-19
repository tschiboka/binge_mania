import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./AdminTransactions.scss";



export default class AdminTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            isLoading: true,
            showInfoOfLine: 1
        };
    }



    async componentDidMount() {
        // load first 10 transactions (transactions size may grow really large)
        const trnsResp = await fetch("/api/transactions/10/1");
        const trnsJSON = await trnsResp.json();
        this.setState({ ...this.state, transactions: trnsJSON, isLoading: false });
    }



    renderTransactions() {
        console.log(this.state.transactions);
        return this.state.transactions.map((tr, i) => (
            <tr key={"admin-transaction" + i}
                className={this.state.showInfoOfLine - 1 === i ? "active" : ""}>
                <td>{this.state.showInfoOfLine - 1 === i ? <span>&#9658;</span> : ""}</td>

                <td>{tr.date}</td>

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
                </div>

                <div className="AdminTransactions__body">
                    <table><tbody>
                        <tr><th></th><th>Date</th><th>User</th><th>Email</th><th>Amount</th></tr>
                        {this.renderTransactions()}
                    </tbody></table>
                    <LoadingSpinner isLoading={this.state.isLoading} />
                </div>
            </div>
        );
    }
}