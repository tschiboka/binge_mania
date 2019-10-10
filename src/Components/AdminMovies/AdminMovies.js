import React, { Component } from "react";



export default class Admin__movies extends Component {
    async handleSearchMovieTitleClick() {
        try {
            const title = document.getElementById("Admin__search-title").value;
            const response = await fetch(`/api/search/${title}`);
            const json = await response.json();

            console.log(json);
        } catch (err) { console.log(err) }
    }

    render() {
        return (
            <div>
                <input id="Admin__search-title" type="text" />
                <button onClick={() => this.handleSearchMovieTitleClick()} > Search movie</button>

                <table>
                    <tbody>

                    </tbody>
                </table>
            </div >
        );
    }
}