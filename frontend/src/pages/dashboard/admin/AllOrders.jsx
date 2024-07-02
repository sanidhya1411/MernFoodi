import React from 'react'
import useAuth from "../../../hooks/useAuth"
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { FaTrashAlt, FaUser, FaUsers } from "react-icons/fa";

const Order = () => {
  const { user } = useAuth()
  const token = localStorage.getItem('access-token')

  const { refetch, data: orders = [] } = useQuery({
      queryKey: ['orders'],
      queryFn: async () => {
          const res = await fetch(`https://foodi-backend-nine.vercel.app/payment/orders`, {
              headers: {
                  authorization: `Bearer ${token}`
              }
          })
          return res.json();
      },
  })

  const format = (createdAt) => {
    const dt = new Date(createdAt);
    return dt.toLocaleDateString();
  }

  return (
    <div>
    <div className="flex items-center justify-between m-4">
      <h5>Total Orders: {orders.length}</h5>
    </div>
     {
      (orders.length > 0) ? <div>
      <div className="">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((item, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{format(item.createdAt)}</td>
                <td>{item.email}</td>
                <td>{item.transactionId}</td>
                <td>
                    {item.itemName.map((element, i) => (
                    <tr key={i} >
                        <td className='px-0 py-1' >{element}</td>
                    </tr>
                    ))}
    
                </td>
                <td>${item.price}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user)} className="btn btn-xs bg-orange-500 text-white">
                    <FaTrashAlt />
                    </button>
                </td>
            </tr>
            ))}
            </tbody>
            {/* foot */}
          </table>
        </div>
      </div>
      </div>: <div className="text-center mt-20">
      <p>Cart is empty. Please add products.</p>
      <Link to="/menu"><button className="btn bg-green text-white mt-3">Back to Menu</button></Link>
    </div>
      }
    </div>
  )
}

export default Order