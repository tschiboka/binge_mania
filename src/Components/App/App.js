import React, { Component } from 'react';
import './App.scss';

import Header from "../Header/Header";
import Admin from "../Admin/Admin";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    }
  }



  login(user) { if (user) this.setState({ ...this.state, user: JSON.parse(user) }); }



  logout() { this.setState({ ...this.state, user: {}, showAdmin: false }); }



  showAdmin(adminIsVisible) { this.setState({ ...this.state, showAdmin: adminIsVisible }); }



  render() {
    return (
      <div className="App">
        <div className={"App__main" + (this.state.showAdmin && " blurred")}>
          <Header
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
            showAdmin={this.showAdmin.bind(this)}
            user={this.state.user} />

          <img src="http://image.tmdb.org/t/p/w185//adw6Lq9FiC9zjYEpOqfq03ituwp.jpg" alt="fightclub" />
        </div>

        <div className="App__admin">
          {this.state.showAdmin &&
            <Admin
              user={this.state.user}
              showAdmin={this.showAdmin.bind(this)} />}
        </div>
      </div>
    );
  }
};
