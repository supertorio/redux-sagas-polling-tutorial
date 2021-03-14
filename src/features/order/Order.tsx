import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { OrderStatus, selectOrderStatus, actions } from "./orderSlice";
import styles from "./Order.module.css";

const availablePizzas = ["Cheese", "Pepperoni"];
const statusDisplay: { [key: string]: string } = {
  Received: "Order Received.",
  Preparing: "Tori is making your pizza.",
  Baking: "Pizza is in the oven.",
  Delivery: "Laney is on the way with your pie.",
  Complete: "Enjoy your pizza!",
};

export function Order() {
  const dispatch = useDispatch();
  const status: OrderStatus = useSelector(selectOrderStatus);
  const activeStatusIndex = Object.keys(statusDisplay).indexOf(status);
  const [selectedPizza, setSelectedPizza] = useState<string>(
    availablePizzas[0]
  );

  if (status === "Pending") {
    return <h2>Submitting your order</h2>;
  }

  if (status === "Ready") {
    return (
      <>
        <h2>Order a pizza</h2>
        <form>
          <ul className={styles.menuItems}>
            {availablePizzas.map((pizza) => (
              <li key={pizza}>
                <label>
                  <input
                    type="radio"
                    name="pizzaType"
                    value={pizza}
                    checked={selectedPizza === pizza}
                    onChange={() => setSelectedPizza(pizza)}
                  />
                  {pizza}
                </label>
              </li>
            ))}
          </ul>
        </form>
        <button
          className={styles.button}
          aria-label="Place Order"
          onClick={() => dispatch(actions.submitOrder(selectedPizza))}
        >
          Place Order
        </button>
      </>
    );
  }

  return (
    <div>
      <ul className={styles.statusList}>
        {Object.keys(statusDisplay).map((sd, i) => (
          <li key={sd} className={activeStatusIndex >= i ? styles.active : ""}>
            {sd}
          </li>
        ))}
      </ul>

      <p>{statusDisplay[status]}</p>
    </div>
  );
}
