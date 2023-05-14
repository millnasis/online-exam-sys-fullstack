import React from "react";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="welcome">
        <div className="up">
          <div className="main"></div>
          <div className="calendar"></div>
        </div>
        <div className="down">
          <div className="preparing"></div>
          <div className="correcting"></div>
          <div className="finished"></div>
        </div>
      </div>
    );
  }
}

export default Welcome;
