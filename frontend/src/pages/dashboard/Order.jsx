import React from 'react'
import useAuth from "../../hooks/useAuth"
import { useQuery } from '@tanstack/react-query'
import {Link} from 'react-router-dom'

const Order = () => {
  const { user } = useAuth()
  const token = localStorage.getItem('access-token')

  const { refetch, data: orders = [] } = useQuery({
      queryKey: ['orders', user?.email],
      queryFn: async () => {
          const res = await fetch(`https://foodi-backend-nine.vercel.app/payment?email=${user?.email}`, {
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
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 mb-5">
      {/* banner */}
      <div className=" bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Track Your<span className="text-green"> Orders</span>
            </h2>
          </div>
        </div>
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
                <th>Transaction Id</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {format(item.createdAt)}
                  </td>
                  <td>{item.transactionId}</td>
                  <td>
                    ${item.price}
                  </td>
                  <td>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
          </table>
        </div>
      </div>
      </div>: <div className="text-center mb-20">
      <p>No Orders.</p>
      <Link to="/menu"><button className="btn bg-green text-white mt-3">Order Now</button></Link>
    </div>
      }
    </div>
  )
}

export default Order