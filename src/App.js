import React from 'react';
import { useState } from 'react';
import './App.css';

const employees = ["Eli", "Phoebe"];

const itemCost = 1;
const products = [
  { name: "fudge brownie", img: "fudgebrownie.jpg", cost: itemCost },
  { name: "Double Chocolate Cookies (x2)", img: "doublechocolatecookies.jpg", cost: itemCost },
  { name: "Peanut Butter Brownie", img: "peanutbutterbrownie.jpg", cost: itemCost },
  { name: "Pumpkin Spice Crispy Treat", img: "pumpkinspicecrispytreat.jpg", cost: itemCost },
  { name: "Pumpkin Spice Roll", img: "pumpkinspiceroll.jpg", cost: itemCost },
  { name: "Sugar Cookie", img: "sugarcookie.jpg", cost: itemCost },
]
const cashAmounts = [
  1, 5, 10, 20
]

const height = 60;
const minWidth = 60;

function App() {
  const [purchaseAnalytics, setPurchaseAnalytics] = useState({});
  const [currentCart, setCurrentCart] = useState(Array(products.length).fill(0));
  const [pendingAmountTendered, setPendingAmountTendered] = useState(0);
  const [changeGuess, setChangeGuess] = useState(0);
  const [guessedCorrect, setGuessedCorrect] = useState(null);
  const [totalAmountRaised, setTotalAmountRaised] = useState(window.localStorage.getItem('totalAmountRaised') || 0);

  const [totalItemsSold, setTotalItemsSold] = useState(window.localStorage.getItem('totalItemsSold') || 0);
  const [actualChange, setActualChange] = useState(0);
  const [currentEmployee, setCurrentEmployee] = useState();

  const setCurrentCartHandler = (value, index) => {
    const newCurrentCart = [...currentCart];
    newCurrentCart[index] = currentCart[index] + value;
    setCurrentCart(newCurrentCart);
  }

  const currentCartTotal = currentCart.reduce((total, current) => {
    return total + current;
  }, 0)
  const productElements = products.map((product, index) => {
    return (
      <div
        className={`product ${currentCart[index] > 0 ? 'selected' : ''}`}
        key={product.name}
        onClick={() => {
          setCurrentCartHandler(product.cost, index)
        }}
      >
        <div className="productPicture" style={{background: `url(${product.img}) no-repeat 50% 50%/cover`}}>
          {currentCart[index] > 0 && <div className="productCount">{currentCart[index]}</div>}
        </div>
        <div className="productText">
          {product.name}
        </div>
      </div>
    );
  })
  const cashButtons = cashAmounts.map((cashAmount) => {
    return (<button style={{ height, minWidth }} key={cashAmount} onClick={() => {
      setPendingAmountTendered(pendingAmountTendered + cashAmount);
    }}>+${cashAmount}</button>)
  });
  cashButtons.push(<button style={{ height, minWidth }} onClick={() => {
    setPendingAmountTendered(0);
  }}>reset</button>)
  const changeButtons = cashAmounts.map((cashAmount) => {
    return (<button style={{ height, minWidth }} key={cashAmount} onClick={() => {
      setChangeGuess(changeGuess + cashAmount);
    }}>+${cashAmount}</button>);
  })
  changeButtons.push(<button style={{ height, minWidth }} onClick={() => {
    setChangeGuess(0);
  }}>reset</button>)
  const employeeResetElements = employees.map((employee) => {
    return (
      <div
        className={`employee ${currentEmployee === employee ? 'selected' : ''}`}
        key={employee}
        onClick={() => {
          setCurrentEmployee(employee);
          setCurrentCart(Array(products.length).fill(0));
          setPendingAmountTendered(0);
          setActualChange(0);
          setChangeGuess(0);
          setGuessedCorrect(null);
        }}
      >
        <div className={`employeePicture ${employee.toLowerCase()}`} />
        <div className="employeeName">{employee}</div>
      </div>
    )
  })
  return (
    <div className="root">
      <div className="employeeRow">{employeeResetElements}</div>
      <div className="productRow">{productElements}</div>

      <div className="moneyRow">
        <div className="moneyItem">
          <div className="moneyText">They owe you</div>
          <div className="moneyNumber">${currentCartTotal}</div>
        </div>
        <div className="moneyItem">
          <div className="moneyText">They gave you</div>
          <div className="moneyNumber">${pendingAmountTendered}</div>
          <div className="moneyButtonRow">{cashButtons}</div>
        </div>
        <div className="moneyItem">
          <div className="moneyText">How much you think you should give back</div>
          <div>
            {guessedCorrect == null ? (
              <div className="moneyNumber">${changeGuess}</div>
            ) : (
              guessedCorrect === true ? (
                <div className="moneyNumber">${changeGuess} <span className="tada">🎉</span></div>
              ) : (
                <div className="moneyNumber">
                  <span className="strike">${changeGuess}</span>{' '}
                  ${actualChange}
                </div>
              )
            )}
          </div>
          <div className="moneyButtonRow">{changeButtons}</div>
        </div>
        <div className="moneyItem shrink">
          <div
            className={`checkButton ${guessedCorrect != null ? 'checked' : ''}`}
            onClick={() => {
              const change = pendingAmountTendered - currentCartTotal;
              setActualChange(change);
              if (change === changeGuess) {
                setGuessedCorrect(true);
              } else {
                setGuessedCorrect(false);
              }
              const newTotalAmount = currentCartTotal + totalAmountRaised;
              const newTotalItemsSold = (currentCartTotal / itemCost) + parseInt(totalItemsSold, 10);
              setTotalAmountRaised(newTotalAmount);
              setTotalItemsSold(newTotalItemsSold);
              window.localStorage.setItem('totalAmount', newTotalAmount);
              window.localStorage.setItem('totalItemsSold', newTotalItemsSold);
            }}
          >Check</div>
        </div>
      </div>


      <h2>Bake sale totals:</h2>
      <div>Items sold: {totalItemsSold}</div>
      <div>Total Raised: ${totalAmountRaised}.00</div>
    </div>
  );
}

export default App;
