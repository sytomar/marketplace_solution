const _ = require('lodash');
const commonHelper = require('../helpers/common');
const productModel = require('../models/product');

exports.getProductList = async (req, res) => {
    let response = {
        'current_page': 0,
        'pages': [],
        'data': []
    }

    response.current_page = _.has(req.query, ['page']) ? parseInt(_.get(req.query, ['page'])): 0;

    // compute skip limit
    let paginated_data = await commonHelper.getSkipLimit(response.current_page);

    // sort the product
    let get_products = await productModel.getAllSortedProductList(paginated_data.skip, paginated_data.limit);
    response.data = get_products.data;

    // compute pages
    let page_info = await commonHelper.getPages(response.current_page, get_products.count);
    response.pages = page_info.pages;
    
    res.render("products", {response: response});
}

exports.getProductDetail = async (req, res) => {
    let response = {
        'isExist': false,
        'data': null
    }
    
    let product_id = req.params.product_id;

    // sort the product
    let get_product = await productModel.getProductDetail(parseInt(product_id));
    if (get_product.isExist) {
        response.isExist = true;
        response.data = get_product.data;
    }
    
    res.render("productDetail", {response: response});
}