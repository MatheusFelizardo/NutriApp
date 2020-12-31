import React from "react";
import Header from "./Header";
import "./styles/styles.css";

const Home = () => {
  return (
    <div className="all-content">
      <Header />

      <main className="main-content">
        <h1>Monte sua dieta de forma rápida.</h1>
        <p>
          É muito simples... Você seleciona os alimentos em cada refeição e no
          final o programa calcula o valor total dos principais macronutrientes.
        </p>
        <a href="/dieta">MONTAR DIETA ➝</a>
      </main>
    </div>
  );
};

export default Home;
