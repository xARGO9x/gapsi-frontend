import React from "react";

function MenuHeader(props) {
  return (
    <nav
      className="navbar fixed-top"
      style={{
        background: "lightgrey",
        flex: 1,
        display: "flex",
      }}
    >
      <div className="container-fluid">
        <img src={props.logo} alt="l" style={{ width: "80px" }} />
        <a className="navbar-brand" href="#">
          e-Commerce Gapsi
        </a>
        <button className="navbar-toggler" type="button">
          <img src={props.iconMenu} alt="l" />
        </button>
      </div>
    </nav>
  );
}

export default MenuHeader;
