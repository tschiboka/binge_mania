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
            totalPages: 0,
            filterBy: {}
        };
    }



    async componentDidMount() {
        window.addEventListener("resize", () => this.setFilterSettingsCoordsOnResize());

        // load first 10 transactions (transactions size may grow really large)
        const trnsResp = await fetch("/api/transactions/10/1");
        const trnsJSON = await trnsResp.json();
        let totPages = Math.ceil(trnsJSON.length / 10);
        this.setState({ ...this.state, transactions: trnsJSON.reverse(), isLoading: false, totalPages: totPages });

        // load the rest of the transactions
        const allTrnsResp = await fetch("/api/transactions");
        const allTrnsJSON = await allTrnsResp.json();
        totPages = Math.ceil(allTrnsJSON.length / 10);
        this.setState({ ...this.state, transactions: allTrnsJSON.reverse(), showPagination: true, totalPages: totPages });
    }



    componentWillUnmount() { window.removeEventListener("resize", () => this.setFilterSettingsCoordsOnResize()); }



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



    getCurrentPageTransactions() {
        let transactions = this.state.transactions;
        return _.chunk(transactions, 10)[this.state.page - 1];
    }




    renderTransactions() {
        if (!this.state.transactions.length) return;

        const transactionsOnPage = this.getCurrentPageTransactions();

        return transactionsOnPage.map((tr, i) => (
            <tr key={"admin-transaction" + i}
                className={this.state.showInfoOfLine - 1 === i ? "active" : ""}
                onClick={() => this.setState({ ...this.state, showInfoOfLine: i + 1 })}
            >
                <td>{this.state.showInfoOfLine - 1 === i ? <span>&#9658;</span> : ""}</td>

                <td>{this.formatDate(tr.date)}</td>

                <td>{tr.user.id}</td>

                <td>{tr.user.email}</td>

                <td>{tr.transTotal.toFixed(2)}</td>
            </tr>
        ));
    }



    renderLineInfo() {
        if (!this.state.transactions.length) return;

        const transactionsOnPage = this.getCurrentPageTransactions();
        const line = this.state.showInfoOfLine - 1;
        let movies5Ind = this.state.movies5Ind || 0;
        if (!transactionsOnPage[line].movies[(movies5Ind * 5)]) movies5Ind = 0;
        const movies = transactionsOnPage[line].movies.slice((movies5Ind * 5), (movies5Ind * 5) + 5);

        return (
            <div className="AdminTransactions__complete-line-info">

                <p>[ Page {this.state.page} of {this.state.totalPages}, line {line + 1}, filtered x out of total {this.state.transactions.length} transactions. ]</p>

                <table><tbody>
                    <tr>
                        <td>Date</td><td>{this.formatDate(transactionsOnPage[line].date)}</td>

                        <td>Paid £{transactionsOnPage[line].transTotal}</td>
                    </tr>

                    <tr>
                        <td>User</td>

                        <td>Email: {transactionsOnPage[line].user.email}</td>

                        <td>ID: {transactionsOnPage[line].user.id}</td>
                    </tr>
                </tbody></table>

                <table><tbody>
                    {movies.map((m, i) =>
                        <tr key={"movies5Ind" + movies5Ind + i + line + m._id}>
                            <td>{`${(movies5Ind * 5) + i + 1}. ${m.title}`}</td>

                            <td>{m._id}</td>
                        </tr>)}
                </tbody></table>

                {transactionsOnPage[line].movies.length > 5 && (
                    <div className="AdminTransactions__complete-line-info__movies-pagination">
                        <button
                            onClick={() => { this.setState({ ...this.state, movies5Ind: movies5Ind - 1 }) }}
                            disabled={movies5Ind <= 0}
                        >Prev</button>

                        <p>movies {`${(movies5Ind * 5) + 1} - ${(movies5Ind * 5) + 5}`}</p>

                        <button
                            onClick={() => this.setState({ ...this.state, movies5Ind: movies5Ind + 1 })}
                            disabled={!transactionsOnPage[line].movies[((movies5Ind + 1) * 5)]}
                        >Next</button>
                    </div>
                )}
            </div>
        );
    }



    setInputValid(ignoreInput) {
        const input = document.getElementById("AdminTransactions__pagination__input");

        // in case input was set but pagination button was clicked ignore validation
        // if input was set invalid value it stayed red even if it was reset by a valid placeholder
        if (ignoreInput) { input.classList.remove("invalid"); input.classList.add("valid"); return false; }

        if (isNaN(input.value)) { input.classList.add("invalid"); return false; }

        const valid = Number(input.value) >= 1 && Number(input.value) <= this.state.totalPages;
        if (valid || input.value === "") { input.classList.remove("invalid"); return true; }
        else { input.classList.add("invalid"); return false; }
    }



    handlePaginationInputOnKeyPress(e) {
        if (e.key === "Enter" && this.setInputValid()) {
            this.setState({ ...this.state, page: Number(e.target.value), showInfoOfLine: 1 });
            e.target.value = ""; // unless reset, placeholder with the current page num won't be shown
        }
    }



    handlePaginationButtonClicked(amount) {
        this.setState({ ...this.state, page: this.state.page + amount, showInfoOfLine: 1 });
        const input = document.getElementById("AdminTransactions__pagination__input");
        input.value = "";

        this.setInputValid(true);
    }



    setFilterSettingsCoordsOnResize() {
        if (this.state.openFilterSettings) {
            const filtersDiv = document.getElementById("AdminTransactions__filter-settings");
            const form = document.getElementById("AdminTransactions__filter-form");
            const formRect = form.getBoundingClientRect();
            const [height, width] = [formRect.height, formRect.width];

            filtersDiv.style.width = width - 1.5 + "px";
            filtersDiv.style.top = height + "px";
        }
    }



    renderFilterSettings() {
        // get filter form position for styling (on resizes it rerender layout)
        const form = document.getElementById("AdminTransactions__filter-form");
        const formRect = form.getBoundingClientRect();
        const [height, width] = [formRect.height, formRect.width];

        // validation functions --> form validates while typing in the fields giving immediate form validation
        const getYears = (currYear = new Date().getFullYear()) => ("^(" +
            new Array((currYear - 2000) + 1).fill("")
                .map((y, i) => 2000 + i + "|" + ((2000 + i + "").substr(2, 4)))
                .join("|") + ")$");
        const validateDatesAndTime = (target, propName) => {
            const filterBy = this.state.filterBy;
            filterBy[propName] = target.value;
            this.setState({ ...this.state, filterBy: filterBy });
            const { minDay, minMonth, minYear } = { ...this.state.filterBy };
            const { maxDay, maxMonth, maxYear } = { ...this.state.filterBy };
            const { minHour, minMin } = { ...this.state.filterBy };
            const { maxHour, maxMin } = { ...this.state.filterBy };
            console.log(target, propName,
                [minDay, minMonth, minYear], [maxDay, maxMonth, maxYear],
                [minHour, minMin], [maxHour, maxMin]);
        }

        return <form
            id="AdminTransactions__filter-settings"
            style={{ width: width - 1.5, top: height }}
        >
            <div>
                <span>From Date</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__minDay"
                        type="text" size="2" title="day" pattern="^([1-9]|0[1-9]|1[0-9]|2[0-9]|30|31)$"
                        onChange={e => validateDatesAndTime(e.target, "minDay", "minDate")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__minMonth"
                        type="text" size="2" title="month" pattern="^(0[1-9]|[1-9]|10|11|12)$"
                        onChange={e => validateDatesAndTime(e.target, "minMonth", "minDate")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__minYear"
                        type="text" size="4" pattern={getYears()} title="year"
                        onChange={e => validateDatesAndTime(e.target, "minYear", "minDate")}
                    />
                </div>
            </div>

            <div>
                <span>To Date</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__maxDay"
                        type="text" size="2" pattern="^([1-9]|0[1-9]|1[0-9]|2[0-9]|30|31)$" title="day"
                        onChange={e => validateDatesAndTime(e.target, "maxDay", "maxDate")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__maxMonth"
                        type="text" size="2" pattern="^(0[1-9]|[1-9]|10|11|12)$" title="month"
                        onChange={e => validateDatesAndTime(e.target, "maxMonth", "maxDate")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__maxYear"
                        type="text" size="4" pattern={getYears()} title="year"
                        onChange={e => validateDatesAndTime(e.target, "maxYear", "maxDate")}
                    />
                </div>
            </div>

            <div>
                <span>From Time</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__minHour"
                        type="text" size="2" title="hour" pattern="^(\d|0\d|1\d|2[0-3])$"
                        onChange={e => validateDatesAndTime(e.target, "minHour", "minTime")}
                    />

                    :<input
                        id="AdminTransactions__filter-settings__minMin"
                        type="text" size="2" pattern="^(\d|[0-5]\d)$" title="minute"
                        onChange={e => validateDatesAndTime(e.target, "minMin", "minTime")}
                    />
                </div>
            </div>

            <div>
                <span>From Time</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__maxHour"
                        type="text" size="2" pattern="^(\d|0\d|1\d|2[0-3])$" title="hour"
                        onChange={e => validateDatesAndTime(e.target, "maxHour", "maxTime")}
                    />

                    :<input
                        id="AdminTransactions__filter-settings__maxMin"
                        type="text" size="2" pattern="^(\d|[0-5]\d)$" title="minute"
                        onChange={e => validateDatesAndTime(e.target, "maxMin", "maxTime")}
                    />
                </div>
            </div>

            <div>
                <span>User ID</span>

                <div>
                    <input type="text" size="20" pattern="^[a-fA-F0-9]{24}$" title="ID: 24 char" />
                </div>
            </div>

            <div>
                <span>User Email</span>

                <div>
                    <input type="email" size="20" />
                </div>
            </div>

            <div>
                <span>Paid</span>

                <div>
                    <input
                        type="text" size="5"
                        pattern="^\d{1,4}((\.\d\d)?|(\.\d))?$"
                        onChange={(e, max = Number(this.state.filterBy.maxPaid)) => {
                            if (max && (Number(e.target.value >= max))) { e.target.setCustomValidity(`Value must be less than ${max}`); }
                            else { e.target.setCustomValidity(""); }
                            this.setState({ ...this.state, filterBy: { ...this.state.filterBy, minPaid: e.target.value } });
                        }}
                    />

                    -<input
                        type="text" size="5"
                        min={this.state.filterBy.minPaid ? this.state.minPaid + 0.01 : 0}
                        pattern="^\d{1,4}((\.\d\d)?|(\.\d))?$"
                        onChange={(e, min = Number(this.state.filterBy.minPaid) || 0) => {
                            if (Number(e.target.value <= min)) { e.target.setCustomValidity(`Value must be greater than ${min}`); }
                            else { e.target.setCustomValidity(""); }
                            this.setState({ ...this.state, filterBy: { ...this.state.filterBy, maxPaid: e.target.value } });
                        }}
                    />
                </div>
            </div>

            <div>
                <span>Title</span>

                <div>
                    <input type="text" size="20" />
                </div>
            </div>

            <div>
                <span>Movie ID</span>

                <div>
                    <input type="text" size="20" pattern="^[a-fA-F0-9]{24}$" title="ID: 24 char" />
                </div>
            </div>

            <button>Reset</button>
        </form>;
    }



    render() {
        return (
            <div className="AdminTransactions">
                <div className="AdminTransactions__header">
                    <form
                        id="AdminTransactions__filter-form"
                        className={this.state.openFilterSettings ? "AdminTransactions__filter--open" : ""}
                        onSubmit={e => e.preventDefault()}>
                        <div className="AdminTransactions__filter-by">
                            <input type="text" disabled />

                            <button onClick={() => this.setState({ ...this.state, openFilterSettings: !this.state.openFilterSettings })}>&#9660;</button>

                            <button onClick={() => alert("FILTER")}>Filter</button>
                        </div>
                    </form>

                    {this.state.showPagination && <div className="AdminTransactions__pagination">
                        <button
                            disabled={this.state.page <= 1}
                            onClick={() => this.handlePaginationButtonClicked(-1)}
                        >&#9668;</button>

                        <input
                            id="AdminTransactions__pagination__input"
                            placeholder={this.state.page}
                            onChange={() => this.setInputValid()}
                            onKeyPress={e => this.handlePaginationInputOnKeyPress(e)}
                        />

                        <span>of&nbsp;{this.state.totalPages}</span>

                        <button
                            disabled={this.state.page >= this.state.totalPages}
                            onClick={() => this.handlePaginationButtonClicked(1)}
                        >&#9658;</button>

                        <button>&#x27f3;</button>
                    </div>}

                    {this.state.openFilterSettings && this.renderFilterSettings()}
                </div>

                <div className="AdminTransactions__body">
                    <table className="Admintransactions__main-table"><tbody>
                        <tr>
                            <th></th> {/* Placeholder for active line arrow*/}

                            <th onClick={() => this.sortTable("default")}><span>Date</span>{this.addSortArrow("default")}</th>

                            <th onClick={() => this.sortTable("user-id")}><span>User ID</span>{this.addSortArrow("user-id")}</th>

                            <th onClick={() => this.sortTable("email")}><span>Email</span>{this.addSortArrow("email")}</th>

                            <th onClick={() => this.sortTable("amount")}><span>Amount</span>{this.addSortArrow("amount")}</th>
                        </tr>

                        {this.renderTransactions()}
                    </tbody></table>

                    {this.renderLineInfo()}

                    <LoadingSpinner isLoading={this.state.isLoading} />
                </div>
            </div>
        );
    }
}