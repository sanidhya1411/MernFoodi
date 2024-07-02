import React, { useState, useEffect } from 'react';
import useAuth from "../../../hooks/useAuth";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Dashboard = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('access-token');
  const axiosSecure = useAxiosSecure();
  const [localOrders, setLocalOrders] = useState([]);

  const { refetch, data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch(`https://foodi-backend-nine.vercel.app/payment/orders`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      return res.json();
    },
  });

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);


  const format = (createdAt) => {
    const dt = new Date(createdAt);
    return dt.toLocaleDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    );
  };

  const todayOrders = localOrders.filter(order => isToday(order.createdAt));
  const confirmOrders = todayOrders.filter(order => order.status === "Confirmed");
  const totalRevenue = confirmOrders.reduce((total, order) => total + order.price, 0);

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <h5>Total Orders for Today: {todayOrders.length}</h5>
        <h5>Total Revenue: $ {totalRevenue}</h5>
      </div>
      {todayOrders.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Order Date</th>
                  <th>Email</th>
                  <th>Transaction Id</th>
                  <th>Items</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{format(item.createdAt)}</td>
                    <td>{item.email}</td>
                    <td>{item.transactionId}</td>
                    <td>
                      {item.itemName.map((element, i) => (
                        <tr key={i}>
                          <td className='px-0 py-1'>{element}</td>
                        </tr>
                      ))}
                    </td>
                    <td>${item.price}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>No orders for today..</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;