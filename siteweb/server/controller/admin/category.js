const Category = require('../../models/Category')
const Product = require('../../models/Product')


function createCategoryList(categories, parentId = null) {

    const categoryList = []

    let categorys

    if (parentId == null) {
        //get first parents
        categorys = categories.filter((category) => category.parentId == undefined)

    } else categorys = categories.filter((category) => category.parentId == parentId)

    for (let category of categorys ) {
        categoryList.push({
            _id: category._id,
            name: category.name,
            parentId: category.parentId,
            children: createCategoryList(categories, category._id) 
        })
    }

    return categoryList


}

function deleteProducts(products, categoryId) {
    return new Promise((resolve) => {

        let productsImagesToDelete = [];

         products.forEach(async (element, index) => {
            
            if (element.categoryId._id == categoryId || element.categoryId.parentId == categoryId) {

                //productsImagesToDelete.push(element.productPictures)
                productsImagesToDelete = productsImagesToDelete.concat(element.productPictures)

                await element.remove()

                console.log('aaaa',productsImagesToDelete)
            }

            if (index == products.length - 1) return resolve(productsImagesToDelete)
            
        }); 


    })
}


exports.getCategories = (req, res) => {

    Category.find({})
        .then((categories) => {


            if(!categories) return res.status(201).json({message: "No Found Category"})

            const categoryList = createCategoryList(categories)

            res.status(200).json({categories: categoryList})


        })
        .catch((error) => res.status(400).json({error}))
}

exports.addCategory = async (req, res) => {

        const category = {
            name: req.body.name
        }
    
        if (req.body.parentId) category.parentId = req.body.parentId

        const newCategory = new Category(category)

        newCategory.save()
            .then((category) => {
                
                return res.status(200).json({category: category})
            })
            .catch((error) => res.status(400).json({error: error}))
}

exports.deleteParentCategory = async (req, res) => {
    //delete parent + his children

    //first : delete products of these categories

    const products = await Product.find({}).populate('categoryId')

    const productsImagesToDelete = await deleteProducts(products, req.body.categoryId)

    if (!req.body.categoryId) return res.status(400).json({error: "Select Category to delete"})
    
    Category.deleteMany({
        "$or": [
            {_id: req.body.categoryId},
            {parentId: req.body.categoryId}
        ]
    }).then((deletedElements) => {
        return res.status(200).json({imagesToDelete: productsImagesToDelete})
    }).catch((error) => res.status(400).json({error: error}))
}

exports.deleteChildCategory = async (req, res) => {

    const products = await Product.find({}).populate('categoryId')

    const productsImagesToDelete = await deleteProducts(products, req.body.categoryId)

    //await Product.deleteMany({categoryId: req.body.categoryId})

    await Category.findOneAndDelete({_id: req.body.categoryId})

    return res.status(200).json({imagesToDelete: productsImagesToDelete})

}

exports.getCategoryById = async (req, res) => {  // get parent

        const parentCategory = await Category.findOne({_id: req.body.parentId})

        if (parentCategory) return res.status(200).json({parentCategory})
        else return res.status(400).json({error: "Error parent category"})

}
