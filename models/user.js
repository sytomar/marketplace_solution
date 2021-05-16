let names = require('../db/names.json');
const _ = require('lodash');
const commonHelper = require('../helpers/common');

exports.getAllUsersList = async () => {
    let response = {
        'data': [],
        'count': names.length
    }

    response.data = _.sortBy(names, ['id']);
    
    return response;
}

exports.getUsersList = async (skip, limit) => {
    let response = {
        'data': [],
        'count': names.length
    }

    let sorted_users = _.sortBy(names, ['id'], ['desc']);

    // slice the paginated data
    response.data = _(sorted_users).slice(skip).take(limit).value();

    return response;
}

exports.getUserDetail = async (user_id) => {
    let response = {
        'isExist': false,
        'data': null
    }

    // get the product
    let get_user = _.filter(names, {'id': parseInt(user_id)});
    if (get_user.length) {
        response.isExist = true;
        response.data = get_user[0];
    }
    
    return response;
}