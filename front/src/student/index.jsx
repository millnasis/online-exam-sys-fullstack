import React from "react";
import ReactDom from "react-dom";

import { Provider } from "react-redux";
import App from "./app.jsx";
import store from "./reducers/createStore";

function Home(props) {
  return (
    <Provider store={store}>
      <App></App>
    </Provider>
  );
}

ReactDom.render(<Home></Home>, document.querySelector("#app"));
