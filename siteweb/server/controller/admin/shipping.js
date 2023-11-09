const Shipping = require('../../models/Shipping')

exports.addCountry = async (req, res) => {

    const country = new Shipping({
        country : req.body.country,
        days: req.body.days,
        prices: req.body.prices
    })

    country.save()
        .then((country) => {
            return res.status(200).json({country})
        })
        .catch((error) => {
            return res.status(400).json({error})
        } )
  
}

exports.getShippingPricing = async (req, res) => {
    console.log(req.body.country)
    Shipping.findOne({country: req.body.country})
        .then((country) => {
            return res.status(200).json({country})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })
}

exports.addPriceToCountry = async (req, res) => {
    Shipping.updateOne({country: req.body.country}, {$push: {prices: {weight: req.body.weight, price: req.body.price}}})
        .then((result) => {
            return res.status(200).json({result})
        })
        .catch((error) => {
            return res.status(400).json({error})
        })
}


