import React, { useEffect, useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaPaypal } from 'react-icons/fa';
import useAuth from "../../hooks/useAuth"
import useAxiosSecure from "../../hooks/useAxiosSecure"
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const CheckoutForm = ({ price, cart }) => {

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('')
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  const navigate= useNavigate()

  useEffect(() => {
    if (typeof price !== 'number' || price < 1) {
      return;
    }
    axiosSecure.post('/create-payment-intent',{price}).then(res=>{setClientSecret(res.data.clientSecret)})
  },[price,axiosSecure])
  
  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }


    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
      setCardError(error.message)
    } else {
      setCardError('Success')
    }

    const {paymentIntent, error:confirmError} = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "anonymous",
            email:user?.email || 'unknown',
          },
        },
      },
    );
    if (paymentIntent.status === 'succeeded') {
      setCardError(`Your Transaction id is ${paymentIntent.id}`)
    }
    const paymentInfo = {
      email: user.email,
      transactionId: paymentIntent.id,
      price,
      quantity: cart.length,
      status: "Order Pending",
      itemName: cart.map(item => item.name),
      cartItems: cart.map(item => item._id),
      menuItems:cart.map(item=>item.menuItemId)
    }
    axiosSecure.post('/payment', paymentInfo).then(res => {
      toast.success('Payment Successfull', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate('/order')
    })
  };

  return (
    <div className='flex flex-col sm:flex-row justify-start items-start gap-8'>
      <div className='md:w-1/2 w-full space-y-3'>
        <h4 className='text-lg font-semibold'>Order Summary</h4>
        <p>Total price: ${price}</p>
        <p>Number of Items: {cart.length}</p>
      </div>

      <div className='md:w-1/2 w-full space-y-3 card shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-7'>
        <h4 className='text-lg font-semibold'>Process Your Payment</h4>
        <h5>Credit/Debit Card</h5>
        <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button type="submit" disabled={!stripe} className='btn btn-sm mt-5 btn-primary w-full text-white'>
        Pay
      </button>
        </form>
        {
          cardError ? <p className='text-red italic text-xs'>{ cardError}</p>:""
        }
        <div className='mt-5 text-center'>
          <hr />
          <button type="submit" disabled={!stripe} className='btn btn-sm mt-5 bg-orange-500 text-white'>
        <FaPaypal/> Pay with Paypal
      </button>

        </div>
      </div>
    </div>
  )
}

export default CheckoutForm