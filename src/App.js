import React from "react";
import Alimentos from "./Alimentos";
import Home from "./Home";

const App = () => {
  const page = window.location.pathname;

  if (page === "/")
    return (
      <div>
        {" "}
        <Home />{" "}
      </div>
    );
  if (page === "/dieta")
    return (
      <div>
        {" "}
        <Alimentos />
      </div>
    );
};

export default App;
