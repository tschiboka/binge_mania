import React, { Component } from 'react';
import "./AdminTransactions.scss";



export default class AdminTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = { transactions: [], isLoading: true };
    }



    async componentDidMount() {
        // get first 10 transaction
        const BODY = { limit: 10, page: 1 };
        const HEADER = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(BODY)
        }
        const trnsResp = await fetch("/api/transactions/", HEADER);
        const trnsJSON = await trnsResp.json();

        console.log(trnsJSON);

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
            </div>
        );
    }
}