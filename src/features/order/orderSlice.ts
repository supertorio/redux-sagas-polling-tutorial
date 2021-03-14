import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type OrderStatus =
  | "Ready"
  | "Pending"
  | "Received"
  | "Preparing"
  | "Baking"
  | "Delivery"
  | "Complete"
  | "Error";

interface OrderState {
  orderDetails: string;
  orderStatus: OrderStatus;
  orderNumber?: string;
}

const initialState: OrderState = {
  orderDetails: "",
  orderStatus: "Ready",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    submitOrder(state, action: PayloadAction<string>) {
      return {
        ...state,
        orderDetails: action.payload,
        orderStatus: "Pending",
      };
    },
    submitOrderComplete(
      state,
      action: PayloadAction<{ orderNumber?: string; orderStatus: OrderStatus }>
    ) {
      return {
        ...state,
        orderNumber: action.payload?.orderNumber,
        orderStatus: action.payload.orderStatus,
      };
    },
    updateOrderStatus(state, action: PayloadAction<OrderStatus>) {
      return {
        ...state,
        orderStatus: action.payload,
      };
    },
  },
});

export const selectOrderNumber = (state: RootState) => state.order.orderNumber;
export const selectOrderStatus = (state: RootState) => state.order.orderStatus;
export const { actions, reducer, name: sliceKey } = orderSlice;
