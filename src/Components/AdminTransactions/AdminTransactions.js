import React, { Component } from 'react';
import "./AdminTransactions.scss";



export default class AdminTransactions extends Component {

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