import React, { Component } from "react";



export default class Admin__movies extends Component {
    render() {
        handleFetchMovieClick() {

        }



        return (
            <div>
                <div><button onClick={this.handleFetchMovieClick()}>Fetch movie</button></div>

                <table>
                    <tbody>

                    </tbody>
                </table>
            </div>
        );
    }
}