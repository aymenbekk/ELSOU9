const Attribute = require('../../models/Attribute')


exports.createAttribute = async (req, res) => {

    const attribute = new Attribute({
        name: req.body.name,
        dataList: req.body.dataList
    })

    try {

        const savedAtt = await attribute.save()
        return res.status(200).json({attribute: savedAtt})

    } catch(error) {
        return res.status(400).json({error})
    }

}

exports.deleteAttribute = async (req, res) => {

    if (req.body.attributeId) {
        await Attribute.deleteOne({_id: req.body.attributeId})
        return res.status(200).json({success: true})
    }


}