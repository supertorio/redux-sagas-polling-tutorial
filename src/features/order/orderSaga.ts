import { PayloadAction } from "@reduxjs/toolkit";
import {
  call,
  put,
  take,
  takeLatest,
  select,
  delay,
  race,
} from "redux-saga/effects";

import { actions, OrderStatus, selectOrderNumber } from "./orderSlice";
import { mockPostOrderAPI, mockOrderStatusAPI } from "./orderService";

// Time between polling iterations in MS.
const POLLING_DELAY = 2500;

// Name of action which ends the polling
const CANCEL_STATUS_POLLING = "CancelStatusPolling";

// Default Saga
export function* orderSaga() {
  yield takeLatest(actions.submitOrder.type, submitOrder);
}

export function* submitOrder(action: PayloadAction<string>) {
  try {
    // 1. Submit Order
    const { orderNumber, orderStatus } = yield call(
      mockPostOrderAPI,
      action.payload
    );

    //2. Process Response
    yield put(actions.submitOrderComplete({ orderNumber, orderStatus }));

    //3. Start Polling
    yield call(pizzaStatusWatchWorker);
  } catch (error) {
    yield put(
      actions.submitOrderComplete({ orderNumber: "", orderStatus: "Error" })
    );
  }
}

export function* pizzaStatusWatchWorker() {
  // Race starts two concurrent effects. We start our polling effect 'task'. As soon as
  // the take effect 'cancelled' is triggered, the 'task' will be cancelled.
  yield race({
    //4. Start the polling worker
    task: call(pizzaStatusPollingWorker),
    //5. Start a take effect waiting for the cancel action.
    cancel: take(CANCEL_STATUS_POLLING),
  });
}

export function* pizzaStatusPollingWorker() {
  // 6. Run indefinitely
  while (true) {
    try {
      // 7. Fetch the new status from the API using the current order number
      const currentOrderNumber: string = yield select(selectOrderNumber);
      const newStatus: OrderStatus = yield call(
        mockOrderStatusAPI,
        currentOrderNumber
      );

      // 8. Update the store with new status
      yield put(actions.updateOrderStatus(newStatus));

      // 9. Check if a status is encountered that triggers an end to the polling
      if (newStatus === "Complete" || newStatus === "Error") {
        // 10. Dispatch the cancel action if the polling is done
        yield put({ type: CANCEL_STATUS_POLLING });
      } else {
        // 11. Otherwise, delay before the next polling iteration
        yield delay(POLLING_DELAY);
      }
    } catch (error) {
      // Catch any unexpected errors and cancel polling if something goes wrong.
      console.error(error);
      yield put({ type: CANCEL_STATUS_POLLING });
      yield put(actions.updateOrderStatus("Error"));
    }
  }
}
