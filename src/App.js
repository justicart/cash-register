import React from 'react';
import { useState } from 'react';
import './App.css';

const itemCost = 1;
const products = [
  { name: "fudge brownie", cost: itemCost },
  { name: "Double Chocolate Cookies (x2)", cost: itemCost },
  { name: "Peanut Butter Brownie", cost: itemCost },
  { name: "Pumpkin Spice Crispy Treat", cost: itemCost },
  { name: "Pumpkin Spice Roll", cost: itemCost },
]
const cashAmounts = [
  1, 5, 10, 20
]

const height = 60;
const minWidth = 60;

function App() {
  const [purchaseAnalytics, setPurchaseAnalytics] = useState({});
  const [currentCart, setCurrentCart] = useState(0);
  const [pendingAmountTendered, setPendingAmountTendered] = useState(0);
  const [changeGuess, setChangeGuess] = useState(0);
  const [totalAmountRaised, setTotalAmountRaised] = useState(window.localStorage.getItem('totalAmountRaised') || 0);

  const [totalItemsSold, setTotalItemsSold] = useState(window.localStorage.getItem('totalItemsSold') || 0);
  const productElements = products.map((product) => {
    return (
      <button style={{ height, minWidth }} key={product.name} onClick={() => {
        setCurrentCart(currentCart + product.cost)
      }}>
        {product.name}
      </button>
    );
  })
  const cashButtons = cashAmounts.map((cashAmount) => {
    return (<button style={{ height, minWidth }} key={cashAmount} onClick={() => {
      setPendingAmountTendered(pendingAmountTendered + cashAmount);
    }}>${cashAmount}</button>)
  });
  cashButtons.push(<button style={{ height, minWidth }} onClick={() => {
    setPendingAmountTendered(0);
  }}>reset</button>)
  const changeButtons = cashAmounts.map((cashAmount) => {
    return (<button style={{ height, minWidth }} key={cashAmount} onClick={() => {
      setChangeGuess(changeGuess + cashAmount);
    }}>
      ${cashAmount}</button>);
  })
  changeButtons.push(<button style={{ height, minWidth }} onClick={() => {
    setChangeGuess(0);
  }}>reset</button>)
  const [actualChange, setActualChange] = useState(0);
  const employees = ["Eli", "Phoebe"];
  const [currentEmployee, setCurrentEmployee] = useState();
  const employeeResetElements = employees.map((employee) => {
    return (<button style={{ height, minWidth }} onClick={() => {
      setCurrentEmployee(employee);
      setCurrentCart(0);
      setPendingAmountTendered(0);
      setActualChange(0);
      setChangeGuess(0);
      setGuessedCorrect(null);
    }} key={employee}>{employee}</button>)
  })
  const [guessedCorrect, setGuessedCorrect] = useState(null);
  return (
    <div>
      <div>Ready for the next employee?</div>
      {employeeResetElements}
      <h2> Current employee: {currentEmployee} </h2>
      {productElements}
      <div>Cart total: <b>${currentCart}.00</b></div>
      <div>Enter cash total</div>
      {cashButtons}
      <div>Cash tendered: <b>${pendingAmountTendered}.00</b> </div>
      <div>How much change do you think it'll be?</div>
      {changeButtons}
      <div>Change estimated total: <b>${changeGuess}.00</b></div>
      <button style={{ height, minWidth }} onClick={() => {
        const change = pendingAmountTendered - currentCart;
        setActualChange(change);
        if (change === changeGuess) {
          setGuessedCorrect(true);
        }
        const newTotalAmount = currentCart + totalAmountRaised;
        const newTotalItemsSold = (currentCart / itemCost) + totalItemsSold;
        setTotalAmountRaised(newTotalAmount);
        setTotalItemsSold(newTotalItemsSold);
        window.localStorage.setItem('totalAmount', newTotalAmount);
        window.localStorage.setItem('totalItemsSold', newTotalItemsSold);
      }}>Check out</button>
      <div>Their actual change is <b>${actualChange}.00</b></div>
      <div>You estimated <b>${changeGuess}.00</b>. Your estimation was <b>{guessedCorrect === true ? "right!" : "incorrect."}</b></div>


      <h2>Bake sale totals:</h2>
      <div>Items sold: {totalItemsSold}</div>
      <div>Total Raised: ${totalAmountRaised}.00</div>
    </div>
  );
}

export default App;
