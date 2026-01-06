import { useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import userLogin from "../context/UserLogin";
// import "./ComponentCSS/Order.css";

function Order() {
  const { LoginToken } = useContext(userLogin);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/Order/GetAllOrder`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${LoginToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.isSuccess) {
        setOrders(data.result);
      } else {
        setError(data.errorMessage?.[0] || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-3">Loading orders...</div>;
  if (error) return <div className="p-3 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Full Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.fullName}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.orderStatus === "Approved"
                          ? "bg-primary"
                          : order.orderStatus === "Picked"
                          ? "bg-warning"
                          : order.orderStatus === "Shipped"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>Rs. {order.orderTotal}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.orderDetails.map((detail) => (
                        <li key={detail.id} className="small">
                           {detail.count} x {detail.foodItem?.foodName}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Order;
