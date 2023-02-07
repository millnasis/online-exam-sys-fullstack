import axios from "axios";
import React from "react";
import ReactDom from "react-dom";

ReactDom.render(
  <div>
    成功，用户信息：{localStorage.getItem("userinfo")}
    <a
      onClick={async () => {
        await axios.delete("/session");
        location.href = "/login";
      }}
    >
      点击退出登陆
    </a>
  </div>,
  document.querySelector("#root")
);
