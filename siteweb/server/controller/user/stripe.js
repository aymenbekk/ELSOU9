const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../../models/Order')
const Cart = require('../../models/Cart')


function getOrderItemsAndTotalAmount(cartItems) {
  return new Promise((resolve) => {
      
      let orderItems = []
      let totalAmount = 0  // + SHIPPING

      for (var i = 0; i < cartItems.length; i++) {

          const item = cartItems[i]
          
          orderItems.push({
              productId: item.productId,
              quantity: item.quantity,
              payablePrice : item.quantity * item.productId.price

          }) 
          const payablePrice = item.quantity * item.productId.price
          totalAmount = totalAmount + payablePrice

          if (i == cartItems.length - 1) return resolve({orderItems, totalAmount})


      }
  })
}


exports.generateIntentPayment = async (req, res) => {

  const userPrice = req.body.price*100;  // stripe works with cent

  const intent = await stripe.paymentIntents.create({
    
    amount: userPrice,
    currency: 'eur'

  });

  res.json({client_secret: intent.client_secret, intent_id:intent.id});

}

exports.confirmPayment = async (req, res) => {

    const paymentType = String(req.body.payment_type);
  
    if (paymentType == "stripe") {
  
      const clientid = String(req.body.payment_id);
  
      stripe.paymentIntents.retrieve(
        clientid,
        function(err, paymentIntent) {
  
          if (err){
            console.log(err);
          }
          
          //respond to the client that the server confirmed the transaction
          if (paymentIntent.status === 'succeeded') {

            
  
            /*After confirm order we save the order and delete the cart*/

            return res.status(200).json({success: true})

          } else {
            res.json({success: false});
          }
        }
      );
    } 
    
}