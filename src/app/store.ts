import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reducer as orderReducer } from "../features/order/orderSlice";

import { orderSaga } from "../features/order/orderSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    order: orderReducer,
  },
  middleware: [sagaMiddleware],
  devTools: process.env.NODE_ENV !== "production",
});

sagaMiddleware.run(orderSaga);

export type RootState = ReturnType<typeof store.getState>;
