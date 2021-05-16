let names = require('../db/names.json');
let products = require('../db/products.json');
const _ = require('lodash');
const commonHelper = require('../helpers/common');
const fs = require('fs');
const fileName = './db/products.json';

const userModel = require('../models/user');
const productModel = require('../models/product');
// return res.status(200).json(response);
exports.getUsersList = async (req, res) => {
    let response = {
        'current_page': 0,
        'pages': [],
        'data': []
    }

    response.current_page = _.has(req.query, ['page']) ? parseInt(_.get(req.query, ['page'])): 0;

    // compute skip limit
    let paginated_data = await commonHelper.getSkipLimit(response.current_page);

    // get the sorted users
    let get_users = await userModel.getUsersList(paginated_data.skip, paginated_data.limit);
    response.data = get_users.data;

    // compute pages
    let page_info = await commonHelper.getPages(response.current_page, get_users.count);
    response.pages = page_info.pages;

    res.render("users", {response: response});
}

exports.getUserProductList = async (req, res) => {
    let response = {
        'current_page': 1,
        'userId': parseInt(req.params.id),
        'userDetail': null,
        'pages': [],
        'users': [],
        'data': []
    }
    response.current_page = _.has(req.query, ['page']) ? parseInt(_.get(req.query, ['page'])): 0;

    // get current user detail
    let get_current_user = await userModel.getUserDetail(response.userId);
    response.userDetail = get_current_user.data;

    // get all the users
    let get_all_users = await userModel.getAllUsersList();
    response.users = get_all_users.data;

    // compute skip limit
    let paginated_data = await commonHelper.getSkipLimit(response.current_page);

    // filter the product
    let get_filtered_products = await productModel.getUserProductList(response.userId, paginated_data.skip, paginated_data.limit);
    response.data = get_filtered_products.data;

    // compute pages
    let page_info = await commonHelper.getPages(response.current_page, get_filtered_products.count);
    response.pages = page_info.pages;

    res.render("userProducts", {response: response});
}

exports.getUserProductDetail = async (req, res) => {
    let response = {
        'userId': parseInt(req.params.id),
        'productId': parseInt(req.params.product_id),
        'isExist': false,
        'data': null
    }
    
    let product_id = req.params.product_id;

    // sort the product
    let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
    if (get_product.isExist) {
        response.isExist = true;
        response.data = get_product.data;
    }
    
    res.render("userProductDetail", {response: response});
}

exports.getUserProductForm = async (req, res) => {
    let response = {
        'isError': false,
        'userId': req.params.id,
        'images': [],
        'category': []
    }

    // get product images
    let get_product_images = await productModel.getUserProductImages();
    response.images = get_product_images.data;

    // get product categories
    let get_product_categories = await productModel.getUserProductCategories();
    response.category = get_product_categories.data;

    res.render("addUserProduct", {response: response})
}

exports.addUserProduct = async (req, res) => {
    let response = {
        'userId': req.params.id,
        'productId': null,
        'isError': false,
        'images': [],
        'category': [],
        'product': null
    }   

    response.product = {
        "productId": await productModel.getNextUniqueProductId(),
        "productCategory": _.has(req.body, ['category']) ? _.get(req.body, ['category']) : "",
        "productName": _.has(req.body, ['name']) ? _.get(req.body, ['name']) : "",
        "productImage": _.has(req.body, ['image']) ? _.get(req.body, ['image']) : "",
        "productStock": _.has(req.body, ['instock']) ? Boolean(parseInt(_.get(req.body, ['instock']))) : false,
        "productPrice": _.has(req.body, ['price']) ? parseInt(_.get(req.body, ['price'])) : 0,
        "salePrice": 0,
        "productOwnerId": parseInt(req.params.id),
        "productLastModified": new Date(),
        "productLastModifiedTimestamp": parseInt(Date.now()/1000)
    }
    response.productId = response.product.productId;

    // push the new product in the products list
    products.push(response.product);

    // add the product to product db
    let is_error_in_update = await productModel.updateProductDb(products);

    if (is_error_in_update) {
        response.isError = true;

        // get product images
        let get_product_images = await productModel.getUserProductImages();
        response.images = get_product_images.data;

        // get product categories
        let get_product_categories = await productModel.getUserProductCategories();
        response.category = get_product_categories.data;

        res.render("addUserProduct", {response: response});
    } else {
        response = {
            'userId': parseInt(response.userId),
            'productId': parseInt(response.productId),
            'isExist': false,
            'data': null
        }

        // sort the product
        let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
        if (get_product.isExist) {
            response.isExist = true;
            response.data = get_product.data;
        }
        res.render("userProductDetail", {response: response});
    }
}

exports.getUserEditProductForm = async (req, res) => {
    let response = {
        'isError': false,
        'userId': req.params.id,
        'productId': req.params.product_id,
        'product': null,
        'images': [],
        'category': [],
    }

    // get product images
    let get_product_images = await productModel.getUserProductImages();
    response.images = get_product_images.data;

    // get product categories
    let get_product_categories = await productModel.getUserProductCategories();
    response.category = get_product_categories.data;

    // sort the product
    let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
    if (get_product.isExist) {
        response.product = get_product.data;
    }
    
    res.render("editUserProduct", {response: response});
}

exports.editUserProduct = async (req, res) => {
    let response = {
        'data': null,
        'isExist': false,
        'isError': null,
        'userId': req.params.id,
        'productId': req.params.product_id,
        'product': null,
        'images': [],
        'category': [],
    }

    // sort the product
    let product_index = _.findIndex(products, {'productOwnerId': parseInt(response.userId), 'productId': parseInt(response.productId)});
    if (product_index != -1) {
        products[product_index]["productCategory"] = _.has(req.body, ['category']) ? _.get(req.body, ['category']) : "";
        products[product_index]["productName"] = _.has(req.body, ['name']) ? _.get(req.body, ['name']) : "";
        products[product_index]["productImage"] = _.has(req.body, ['image']) ? _.get(req.body, ['image']) : "";
        products[product_index]["productStock"] = _.has(req.body, ['instock']) ? Boolean(parseInt(_.get(req.body, ['instock']))) : false;
        products[product_index]["productPrice"] = _.has(req.body, ['price']) ? parseInt(_.get(req.body, ['price'])) : 0
        products[product_index]["salePrice"] = _.has(req.body, ['sale_price']) ? parseInt(_.get(req.body, ['sale_price'])) : 0
        products[product_index]["productLastModified"] = new Date();
        products[product_index]["productLastModifiedTimestamp"] = parseInt(Date.now()/1000);

        // add the product to product db
        let is_error_in_update = await productModel.updateProductDb(products);
        if (is_error_in_update) {
            response.isError = true;
            
            // get product images
            let get_product_images = await productModel.getUserProductImages();
            response.images = get_product_images.data;

            // get product categories
            let get_product_categories = await productModel.getUserProductCategories();
            response.category = get_product_categories.data;

            // sort the product
            let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
            if (get_product.isExist) {
                response.product = get_product.data;
            }
            
            res.render("editUserProduct", {response: response});
        } else {
            // sort the product
            let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
            if (get_product.isExist) {
                response.isExist = true;
                response.data = get_product.data;
            }
            
            res.render("userProductDetail", {response: response})
        }
    } else {
        // get product images
        let get_product_images = await productModel.getUserProductImages();
        response.images = get_product_images.data;

        // get product categories
        let get_product_categories = await productModel.getUserProductCategories();
        response.category = get_product_categories.data;

        // sort the product
        let get_product = await productModel.getUserProductDetail(response.userId, response.productId);
        if (get_product.isExist) {
            response.product = get_product.data;
        }
        
        res.render("editUserProduct", {response: response});
    }
}