// ✅ src/OrdersLocal.jsx
export function saveOrder(order) {
  try {
    const oldOrders = JSON.parse(localStorage.getItem("guest_orders")) || [];
    localStorage.setItem("guest_orders", JSON.stringify([...oldOrders, order]));
  } catch {
    console.warn("⚠️ Failed to save guest order");
  }
}

export function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem("guest_orders")) || [];
  } catch {
    return [];
  }
}
