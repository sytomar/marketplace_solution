let products = require('../db/products.json');
const _ = require('lodash');
const commonHelper = require('../helpers/common');
const fs = require('fs');
const fileName = './db/products.json';

exports.getNextUniqueProductId = async () => {
    let response = 1;

    let sorted_products = _.sortBy(products, ['productId']).reverse();

    if (sorted_products.length) {
        response = sorted_products[0].productId + 1
    }

    return response;
}

exports.getAllSortedProductList = async (skip, limit) => {
    let response = {
        'data': [],
        'count': products.length
    }

    let sorted_products = _.sortBy(products, ['productLastModifiedTimestamp', 'productId'], ['desc', 'desc']);

    // slice the paginated data
    response.data = _(sorted_products).slice(skip).take(limit).value();

    return response;
}

exports.getProductDetail = async (product_id) => {
    let response = {
        'isExist': false,
        'data': null
    }

    // get the product
    let get_product = _.filter(products, {'productId': parseInt(product_id)});
    if (get_product.length) {
        response.isExist = true;
        response.data = get_product[0];
    }
    
    return response;
}

exports.getUserProductList = async (user_id, skip, limit) => {
    let response = {
        'data': [],
        'count': 0
    }

    // get the user filtered products
    let filtered_products = _.filter(products, {'productOwnerId': parseInt(user_id)});
    response.count = filtered_products.length;

    // sort the filtered data
    let sorted_products = _.sortBy(filtered_products, ['productLastModifiedTimestamp', 'productId']);

    // slice the paginated data
    response.data = _(sorted_products).slice(skip).take(limit).value();

    return response;
}

exports.getUserProductDetail = async (user_id, product_id) => {
    let response = {
        'isExist': false,
        'data': null
    }

    // get the product
    let get_product = _.filter(products, {'productId': parseInt(product_id)});
    if (get_product.length) {
        response.isExist = true;
        response.data = get_product[0];
    }
    
    return response;
}

exports.getUserProductCategories = async () => {
    let response = {
        'isExist': false,
        'data': null
    }

    // get the categories
    let get_product = _.chain(products)
        .uniqBy("productCategory")
        .sortBy("productCategory")
        .map("productCategory")
        .value();
    if (get_product.length) {
        response.isExist = true;
        response.data = get_product;
    }
    
    return response;
}

exports.getUserProductImages = async () => {
    let response = {
        'isExist': false,
        'data': null
    }

    // get the product
    let get_product = _.chain(products)
        .uniqBy("productImage")
        .sortBy("productImage")
        .map("productImage")
        .value();
    if (get_product.length) {
        response.isExist = true;
        response.data = get_product;
    }
    
    return response;
}

exports.updateProductDb = async (updated_product_list) => {
    let response = false;
    await fs.writeFile(fileName, JSON.stringify(updated_product_list), function writeJSON(err) {
        if (err) {
            response = true;
        }
    });
    return response;
}