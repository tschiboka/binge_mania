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
        this.setState({ ...this.state, transactions: allTrnsJSON.reverse(), showPagination: true, totalPages: totPages, originalTransactions: allTrnsJSON.reverse() });
    }



    componentWillUnmount() { window.removeEventListener("resize", () => this.setFilterSettingsCoordsOnResize()); }



    formatDate(dt, d = new Date(dt)) {
        const add0 = n => n < 10 ? "0" + n : n;
        const date = `${d.getDate()}.${Number(d.getMonth()) + 1}.${(d.getFullYear() + "").replace(/^\d{2}/g, "'")}`;
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



    submitFilterForm(e) {
        e.preventDefault();

        const filterProps = Object.keys(this.state.filterBy), filter = this.state.filterBy;

        if (filterProps.length === 0) this.setState(
            {
                ...this.state,
                transactions: this.state.originalTransactions,
                showInfoOfLine: 1,
                page: 1,
                totalPages: Math.ceil(this.state.originalTransactions.length / 10)
            }); // empty filter form sets original transactions back
        else {
            const filteredTransactions = this.state.originalTransactions.filter(transaction => { // always filter the original (unfiltered transactions
                // if date is given --> FROM
                if (filter.minDay) {
                    const year = filter.minYear.length === 4 ? filter.minYear : "20" + filter.minYear;
                    const filterDate = new Date(year, Number(filter.minMonth - 1), filter.minDay, filter.minHour || 0, filter.minMin || 0);
                    if (filterDate > new Date(transaction.date)) return false; // no reason for further exec of func
                }

                // if time given without date, filter by time of the any given day --> FROM
                if (!filter.minDay && filter.minMin) {
                    const transactionDate = new Date(transaction.date);
                    const transactionTimeInMins = (transactionDate.getHours() * 60) + transactionDate.getMinutes();
                    const filterTimeInMins = (Number(filter.minHour) * 60) + Number(filter.minMin);
                    if (filterTimeInMins > transactionTimeInMins) return false;
                }

                // if date is given --> TO
                if (filter.maxDay) {
                    const year = filter.maxYear.length === 4 ? filter.maxYear : "20" + filter.maxYear;
                    const filterDate = new Date(year, Number(filter.maxMonth) - 1, Number(filter.maxDay) + 1, filter.maxHour || 0, filter.maxMin || 0);
                    if (filterDate <= new Date(transaction.date)) return false;
                }

                // if time given without date, filter by time of the any given day --> TO
                if (!filter.maxDay && filter.maxMin) {
                    const transactionDate = new Date(transaction.date);
                    const transactionTimeInMins = (transactionDate.getHours() * 60) + transactionDate.getMinutes();
                    const filterTimeInMins = (Number(filter.maxHour) * 60) + Number(filter.maxMin);
                    if (filterTimeInMins < transactionTimeInMins) return false;
                }

                if (filter.userId) if (filter.userId !== transaction.user.id) return false;

                if (filter.email) if (filter.email !== transaction.user.email) return false;

                if (filter.minPaid) if (filter.minPaid > transaction.transTotal) return false;

                if (filter.maxPaid) if (filter.maxPaid < transaction.transTotal) return false;

                return true;
            });

            this.setState({
                ...this.state,
                transactions: filteredTransactions,
                showInfoOfLine: 1,
                page: 1,
                totalPages: Math.ceil(filteredTransactions.length / 10)
            }, () => console.log(this.state));
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
            // set state.filterBy date and time values regardless of validity
            const filterBy = this.state.filterBy;
            filterBy[propName] = target.value;
            this.setState({ ...this.state, filterBy: filterBy, filterByMsg: "" });

            // check validity of all related fields and terminate func execution if any of them invalid
            const allFields = ["Day", "Month", "Year", "Hour", "Min"]
                .map(e => ["min" + e, "max" + e]).flat()
                .map(el => document.getElementById("AdminTransactions__filter-settings__" + el));
            const allFieldsAreValid = allFields.map(f => f.checkValidity()).every(fs => !!fs);
            if (!allFieldsAreValid) return;

            const { minDay, minMonth, minYear } = { ...this.state.filterBy };
            const { maxDay, maxMonth, maxYear } = { ...this.state.filterBy };
            const { minHour, minMin } = { ...this.state.filterBy };
            const { maxHour, maxMin } = { ...this.state.filterBy };
            const onlyTimeFields = minHour && minMin && maxHour && maxMin && !minDay && !minMonth && !minYear && !maxDay && !maxMonth && !maxYear;
            const timeHasNoInterval = Number(minHour * 60) + Number(minMin) >= Number(maxHour * 60) + Number(maxMin);
            const onlyDateFields = !minHour && !minMin && !maxHour && !maxMin && minDay && minMonth && minYear && maxDay && maxMonth && maxYear;
            const dateHasNoInterval = new Date(minYear, Number(minMonth) - 1, minDay) >= new Date(maxYear, Number(maxMonth) - 1, maxDay);
            const allFieldValues = allFields.map(f => f.value).every(fv => fv.length);
            const [minDate, maxDate] = [new Date(minYear, Number(minMonth) - 1, minDay, minHour, minMin), new Date(maxYear, Number(maxMonth) - 1, maxDay, maxHour, maxMin)];
            const onlyMinDateAndTime = minHour && minMin && !maxHour && !maxMin && minDay && minMonth && minYear && !maxDay && !maxMonth && !maxYear;
            const onlyMaxDateAndTime = !minHour && !minMin && maxHour && maxMin && !minDay && !minMonth && !minYear && maxDay && maxMonth && maxYear;
            const onlyMinDate = !minHour && !minMin && !maxHour && !maxMin && minDay && minMonth && minYear && !maxDay && !maxMonth && !maxYear;
            const onlyMaxDate = !minHour && !minMin && !maxHour && !maxMin && !minDay && !minMonth && !minYear && maxDay && maxMonth && maxYear;
            const onlyMinTime = minHour && minMin && !maxHour && !maxMin && !minDay && !minMonth && !minYear && !maxDay && !maxMonth && !maxYear;
            const onlyMaxTime = !minHour && !minMin && maxHour && maxMin && !minDay && !minMonth && !minYear && !maxDay && !maxMonth && !maxYear;

            // check if all fields are valid non empty values (all min max dates and times)
            if (allFieldValues) { if (minDate >= maxDate) this.setState({ ...this.state, filterByMsg: "Dates and times must create a time interval!" }); }

            // if only time fields are filled and dont make interval 
            else if (onlyTimeFields) { if (timeHasNoInterval) this.setState({ ...this.state, filterByMsg: "Times must create an interval!" }); }

            // if only date fields are filled and dont make interval 
            else if (onlyDateFields) { if (dateHasNoInterval) this.setState({ ...this.state, filterByMsg: "Dates must create an interval!" }); }

            // in any other case if the form is filled up properly give no message
            else if (onlyDateFields || onlyTimeFields || onlyMaxDateAndTime || onlyMinDateAndTime || onlyMinDate || onlyMaxDate || onlyMinTime || onlyMaxTime) { } //NOTHING HAPPENS HERE
            else this.setState({ ...this.state, filterByMsg: "Missing date and/or time value(s)!" });
        }

        return <form
            id="AdminTransactions__filter-settings"
            style={{ width: width - 1.5, top: height }}
            onSubmit={() => this.submitFilterForm()}
        >
            <div>
                <span>From Date</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__minDay"
                        type="text" size="2" title="day" pattern="^([1-9]|0[1-9]|1[0-9]|2[0-9]|30|31)$"
                        value={this.state.filterBy.minDay || ""}
                        onChange={e => validateDatesAndTime(e.target, "minDay")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__minMonth"
                        type="text" size="2" title="month" pattern="^(0[1-9]|[1-9]|10|11|12)$"
                        value={this.state.filterBy.minMonth || ""}
                        onChange={e => validateDatesAndTime(e.target, "minMonth")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__minYear"
                        type="text" size="4" pattern={getYears()} title="year"
                        value={this.state.filterBy.minYear || ""}
                        onChange={e => validateDatesAndTime(e.target, "minYear")}
                    />
                </div>
            </div>

            <div>
                <span>From Time</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__minHour"
                        type="text" size="2" title="hour" pattern="^(\d|0\d|1\d|2[0-3])$"
                        value={this.state.filterBy.minHour || ""}
                        onChange={e => validateDatesAndTime(e.target, "minHour")}
                    />

                    :<input
                        id="AdminTransactions__filter-settings__minMin"
                        type="text" size="2" pattern="^(\d|[0-5]\d)$" title="minute"
                        value={this.state.filterBy.minMin || ""}
                        onChange={e => validateDatesAndTime(e.target, "minMin")}
                    />
                </div>
            </div>

            <div>
                <span>To Date</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__maxDay"
                        type="text" size="2" pattern="^([1-9]|0[1-9]|1[0-9]|2[0-9]|30|31)$" title="day"
                        value={this.state.filterBy.maxDay || ""}
                        onChange={e => validateDatesAndTime(e.target, "maxDay")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__maxMonth"
                        type="text" size="2" pattern="^(0[1-9]|[1-9]|10|11|12)$" title="month"
                        value={this.state.filterBy.maxMonth || ""}
                        onChange={e => validateDatesAndTime(e.target, "maxMonth")}
                    />

                    -<input
                        id="AdminTransactions__filter-settings__maxYear"
                        type="text" size="4" pattern={getYears()} title="year"
                        value={this.state.filterBy.maxYear || ""}
                        onChange={e => validateDatesAndTime(e.target, "maxYear")}
                    />
                </div>
            </div>

            <div>
                <span>To Time</span>

                <div>
                    <input
                        id="AdminTransactions__filter-settings__maxHour"
                        type="text" size="2" pattern="^(\d|0\d|1\d|2[0-3])$" title="hour"
                        value={this.state.filterBy.maxHour || ""}
                        onChange={e => validateDatesAndTime(e.target, "maxHour")}
                    />

                    :<input
                        id="AdminTransactions__filter-settings__maxMin"
                        type="text" size="2" pattern="^(\d|[0-5]\d)$" title="minute"
                        value={this.state.filterBy.maxMin || ""}
                        onChange={e => validateDatesAndTime(e.target, "maxMin")}
                    />
                </div>
            </div>

            <div>
                <span>User ID</span>

                <div>
                    <input
                        type="text" size="20" pattern="^[a-fA-F0-9]{24}$" title="ID: 24 char"
                        value={this.state.filterBy.userId || ""}
                        onChange={e => this.setState({ ...this.state, filterBy: { ...this.state.filterBy, userId: e.target.value } })}
                    />
                </div>
            </div>

            <div>
                <span>User Email</span>

                <div>
                    <input
                        type="email" size="20" value={this.state.filterBy.email || ""}
                        onChange={e => this.setState({ ...this.state, filterBy: { ...this.state.filterBy, email: e.target.value } })}
                    />
                </div>
            </div>

            <div>
                <span>Paid</span>

                <div>
                    <input
                        type="text" size="5"
                        pattern="^\d{1,4}((\.\d\d)?|(\.\d))?$"
                        value={this.state.filterBy.minPaid || ""}
                        onChange={(e, max = Number(this.state.filterBy.maxPaid)) => {
                            if (max && (Number(e.target.value >= max))) { e.target.setCustomValidity(`Value must be less than ${max}`); }
                            else { e.target.setCustomValidity(""); }
                            this.setState({ ...this.state, filterBy: { ...this.state.filterBy, minPaid: e.target.value } });
                        }}
                    />

                    -<input
                        type="text" size="5"
                        value={this.state.filterBy.maxPaid || ""}
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
                    <input
                        type="text" size="20"
                        value={this.state.filterBy.title || ""}
                        onChange={e => this.setState({ ...this.state, filterBy: { ...this.state.filterBy, title: e.target.value } })}
                    />
                </div>
            </div>

            <div>
                <span>Movie ID</span>

                <div>
                    <input
                        type="text" size="20" pattern="^[a-fA-F0-9]{24}$" title="ID: 24 char"
                        value={this.state.filterBy.movieId || ""}
                        onChange={e => this.setState({ ...this.state, filterBy: { ...this.state.filterBy, movieId: e.target.value } })}
                    />
                </div>
            </div>

            {this.state.filterByMsg && <label>{this.state.filterByMsg}</label>}

            <button onClick={e => {
                e.preventDefault();
                this.setState({ ...this.state, filterBy: {}, filterByMsg: "" });
            }}>Reset</button>
        </form>;
    }



    render() {
        const formatFilterText = () => {
            let finalText = "", f = this.state.filterBy;
            const formInputs = [...document.querySelectorAll("#AdminTransactions__filter-settings input")].map(inp => inp.checkValidity()).every(val => !!val);
            if (formInputs) {
                if (!this.state.filterByMsg) {
                    if ((f.minDay && f.minMonth && f.minYear) || (f.minHour && f.minMin)) finalText += "from "
                    if (f.minDay && f.minMonth && f.minYear) finalText += `${f.minDay}.${f.minMonth}.${f.minYear} `;
                    if (f.minHour && f.minMin) finalText += `${f.minHour}:${f.minMin} `;
                    if ((f.maxDay && f.maxMonth && f.maxYear) || (f.maxHour && f.maxMin)) finalText += "to "
                    if (f.maxDay && f.maxMonth && f.maxYear) finalText += `${f.maxDay}.${f.maxMonth}.${f.maxYear} `;
                    if (f.maxHour && f.maxMin) finalText += `${f.maxHour}:${f.maxMin} ,`;
                }
                if (f.userId) finalText += `userId: ${f.userId}, `;
                if (f.email) finalText += `email: ${f.email}, `;
                if (f.minPaid && f.maxPaid) finalText += `£${Number(f.minPaid).toFixed(2)} - £${Number(f.maxPaid).toFixed(2)}, `;
                else {
                    if (f.minPaid) finalText += `<= £${Number(f.minPaid).toFixed(2)}, `;
                    if (f.maxPaid) finalText += `>= £${Number(f.maxPaid).toFixed(2)}, `;
                }
                if (f.title) finalText += `title: ${f.title}, `;
                if (f.movieId) finalText += `movieId: ${f.movieId}`
            }

            return finalText.replace(/, ?$/g, "");
        }

        return (
            <div className="AdminTransactions">
                <div className="AdminTransactions__header">
                    <form
                        id="AdminTransactions__filter-form"
                        className={this.state.openFilterSettings ? "AdminTransactions__filter--open" : ""}
                        onSubmit={e => e.preventDefault()}>
                        <div className="AdminTransactions__filter-by">
                            <input
                                type="text" readOnly
                                size="40"
                                value={formatFilterText()}
                            />

                            <button onClick={() => this.setState({ ...this.state, openFilterSettings: !this.state.openFilterSettings })}>&#9660;</button>

                            <button onClick={e => this.submitFilterForm(e)}>Filter</button>
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