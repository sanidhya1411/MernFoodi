import React, { useState, useEffect } from 'react';
import useAuth from "../../../hooks/useAuth";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TiTick } from "react-icons/ti";
import Swal from "sweetalert2";
import { RxCross1 } from "react-icons/rx";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageOrders = () => {
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

  const handleCancelItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const status = "Cancelled";
        const res = await axiosSecure.patch(`/payment/${item._id}`, { status });
        if (res) {
          setLocalOrders(localOrders.map(order => order._id === item._id ? { ...order, status } : order));
          Swal.fire({
            title: "Cancelled",
            text: "Order has been cancelled.",
            icon: "success",
          });
        }
      }
    });
  };

  const handleConfirmItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Confirm it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const status = "Confirmed";
        const res = await axiosSecure.patch(`/payment/${item._id}`, { status });
        if (res) {
          setLocalOrders(localOrders.map(order => order._id === item._id ? { ...order, status } : order));
          Swal.fire({
            title: "Confirmed!",
            text: "Order has been confirmed.",
            icon: "success",
          });
        }
      }
    });
  };

  const format = (createdAt) => {
    const dt = new Date(createdAt);
    return dt.toLocaleDateString();
  };

  const pendingOrders = localOrders.filter(order => order.status === "Order Pending");

  return (
    <div>
      <div className="flex items-center justify-between m-4">
        <h5>Total Pending Orders: {pendingOrders.length}</h5>
      </div>
      {pendingOrders.length > 0 ? (
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((item, index) => (
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
                    <td className='flex space-between'>
                      <button
                        onClick={() => handleConfirmItem(item)}
                        className="btn btn-ghost text-green text-lg"
                      >
                        <TiTick />
                      </button>
                      <button
                        onClick={() => handleCancelItem(item)}
                        className="btn btn-ghost text-red"
                      >
                        <RxCross1 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;