/**
 * Main Component (functional)
 */
// libraries
import React, { useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
// our stuff
import Content from "./Content.js";
import Header from './../components/Header'
const Main = (props) => {
  // for a bug/problem in react/scheduler
  // combination we cannot use useState here
  const autoReschedule = useRef(false);

  return (
    <React.Fragment>
    
      <div>
        <div className="row">
          <div className="col-md-12">
            <Router>
              <Navbar
                className="color-nav"
                variant="dark"
                expand="lg"
                sticky="top"
              >
                <Navbar.Brand href="#home">CrudManager demo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto"></Nav>
                  <div id="tools" className="row">
                    <button
                      class="b-tool keep b-widget b-button b-outer b-visible-scrollbar b-chrome b-icon-align-start"
                      id="fullscreen-button"
                      data-ref="fullscreenButton"
                      data-btip="true"
                    >
                      <i class="b-icon-fullscreen b-icon"></i>
                      <label data-owner-cmp="fullscreen-button"></label>
                    </button>
                    <button
                      class="b-tool keep b-widget b-button b-outer b-visible-scrollbar b-chrome b-icon-align-start"
                      id="b-button-1"
                      data-ref="codeButton"
                      data-btip="true"
                    >
                      <i class="b-icon-code b-icon"></i>
                      <label data-owner-cmp="b-button-1"></label>
                    </button>
                    <button
                      class="b-tool keep b-widget b-button b-outer b-visible-scrollbar b-chrome b-icon-align-start"
                      id="b-button-2"
                      data-ref="infoButton"
                      data-btip="true"
                    >
                      <i class="b-fa-cog b-fa"></i>
                      <label data-owner-cmp="b-button-2"></label>
                    </button>
                  </div>
                </Navbar.Collapse>
              </Navbar>
            </Router>
          </div>
        </div>
        
        <Content autoReschedule={autoReschedule} />
      </div>
    </React.Fragment>
  );
};

export default Main;
