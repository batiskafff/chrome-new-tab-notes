import Editor from "./Editor";
import React, { Component } from "react";
import {
  updatePage,
  Consumer,
  StateSaver
} from "./state/data";
import SideBar from './SideBar';


export default class extends Component {

  render() {
    return (
      <div className="flex-grow">
        <SideBar />
        <Consumer select={[(state) => state.sideBarOrder[state.selectedIndex], (state) => state.pages[state.sideBarOrder[state.selectedIndex]]]}>{
          (id, page) => (<Editor
              key={id}
              id={id}
              initialState={page}
              onChange={raw => {
                console.log('calling updatePage');
                updatePage(id, raw)
              }}
            />)
        }</Consumer>
        <StateSaver />
      </div>
    );
  }
}