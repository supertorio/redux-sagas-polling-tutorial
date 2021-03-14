import React from "react";
import { Order } from "./features/order/Order";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">Polling for Pizza with Redux Sagas</header>
      <Order />
    </div>
  );
}

export default App;
