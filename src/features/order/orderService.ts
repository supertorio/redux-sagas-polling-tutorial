import { OrderStatus } from "./orderSlice";
const mockTimeout = 400;

export const mockPostOrderAPI = async (
  pizzaType: string
): Promise<{ orderNumber: string; orderStatus: OrderStatus }> => {
  return new Promise((resolve) => {
    const orderNumber = [pizzaType, new Date().getTime()].join("_");
    setTimeout(() => {
      resolve({
        orderNumber,
        orderStatus: "Received",
      });
    }, mockTimeout);
  });
};

export const mockOrderStatusAPI = async (
  orderId: string
): Promise<OrderStatus> => {
  return new Promise((resolve) => {
    const [orderItem, orderTime] = orderId.split("_");
    const elapsedTime = Math.abs(new Date().getTime() - parseInt(orderTime));
    let orderStatus: OrderStatus = "Received";

    if (elapsedTime > 30000) {
      orderStatus = "Complete";
    } else if (elapsedTime > 20000) {
      orderStatus = "Delivery";
    } else if (elapsedTime > 10000) {
      orderStatus = "Baking";
    } else {
      orderStatus = "Preparing";
    }

    setTimeout(() => {
      resolve(orderStatus);
    }, mockTimeout);
  });
};
