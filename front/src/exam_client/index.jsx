import ReactDom from "react-dom";
import App from "./app.jsx";
import React from "react";

function Home(props) {
  return <App></App>;
}

ReactDom.render(<Home></Home>, document.querySelector("#root"));
