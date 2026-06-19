import { useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import userLogin from "../context/UserLogin";
// import "./ComponentCSS/Order.css";

function Order() {
  const { LoginToken } = useContext(userLogin);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const url = selectedStatus
        ? `${API_BASE_URL}/api/Order/GetAllOrder?status=${selectedStatus}`
        : `${API_BASE_URL}/api/Order/GetAllOrder`;

      const response = await fetch(url, {
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

  function toggleOrderDetails(orderId) {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  }

  if (loading) return <div className="p-3">Loading orders...</div>;
  if (error) return <div className="p-3 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Orders</h2>

      {/* Status Filter */}
      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="form-select"
          style={{ width: "200px" }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Orders</option>
          <option value="Approved">Approved</option>
          <option value="Picked">Picked</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <>
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
                            : order.orderStatus === "Delivered"
                            ? "bg-info"
                            : order.orderStatus === "Cancelled"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>Rs. {order.orderTotal}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => toggleOrderDetails(order.id)}
                      >
                        {expandedOrder === order.id ? "Hide Details" : "View Details"}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr key={`${order.id}-details`}>
                      <td colSpan="6">
                        <div className="p-3 bg-light">
                          <h5>Order Items</h5>
                          {order.orderDetails && order.orderDetails.length > 0 ? (
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Item Name</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th>Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.orderDetails.map((detail) => (
                                  <tr key={detail.id}>
                                    <td>{detail.foodItem?.foodName || "N/A"}</td>
                                    <td>{detail.count}</td>
                                    <td>Rs. {detail.price}</td>
                                    <td>Rs. {(detail.count * detail.price).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-muted">No items found</p>
                          )}
                          <div className="mt-2">
                            <strong>Customer Phone: {order.phone || "N/A"}</strong>
                          </div>
                          <div>
                            <strong>Customer Email: {order.applicationUser?.email || "N/A"}</strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Order;
