import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import Main from "./containers/Main.js";
class App extends Component {
  render() {
    console.log(this.resources);
    return (
      <React.Fragment>
        <Main />
      </React.Fragment>
    );
  }
}

export default App;
