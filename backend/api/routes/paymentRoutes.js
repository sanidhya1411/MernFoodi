const express = require('express')
const Payment = require('../models/Payment');
const Carts = require('../models/Carts');
const mongoose=require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const verifyAdmin = require('../middleware/verifyAdmin')

const router = express.Router();
const verifyToken = require('../middleware/verifyToken')

router.post('/',verifyToken, async (req, res) => {
    const payment = req.body;
    try {

        const paymentRequest = await Payment.create(payment)

        const cartId = payment.cartItems.map(id => new ObjectId(id))
        const deleteCart = await Carts.deleteMany({ _id: { $in: cartId } })
        
        res.status(200).json({ paymentRequest, deleteCart })
    
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
})
router.get('/',verifyToken, async(req, res) =>{
    const email = req.query.email
    const query = { email: email }
    try {
        const demail = req.decoded.email
        if (email !== demail) {
            return res.status(403).json({message:"Forbidden Access"})
        }
        const result = await Payment.find(query).sort({ createdAt: -1 }) 
        return res.status(200).json(result)
        
    } catch (error) {
        
    }
    
})

router.get('/orders',verifyToken,verifyAdmin,async (req, res) => {
    try {
      const orders = await Payment.find({}).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


router.patch("/:id", async (req, res) => {
    const payId = req.params.id;
    const { status } = req.body;

    try {
        const updated = await Payment.findByIdAndUpdate(
            payId, {status:status}, {
                new: true, runValidators: true
            }
        )
        if(!updated){
            return res.status(404).json({ message: "Order not found"})
        }
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

router.delete("/:id", async (req, res) => {
    const payId = req.params.id;
    // console.log(menuId)
    try {
        const deletedItem = await Payment.findByIdAndDelete(payId);

        // console.log(deletedItem);

        if(!deletedItem){
            return res.status(404).json({ message:"Order not found"})
        }
        res.status(200).json({message: "Order deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;