const _ = require('lodash');
const limit = 10;

const getSkipLimit = async (page) => {
    let response = {
        "skip": page*limit,
        "limit": limit,
    }
    return response
};

const getPages = async (current_page, total_count) => {
    let response = {
        'pages': [],
        'all_pages': []
    };
    let total_pages = parseInt(total_count/limit);
    if (total_count%limit == 0) {
        response.all_pages = _.range(total_pages);
    } else {
        response.all_pages = _.range(total_pages + 1);
    }
    
    if (current_page == 0) {
        response.pages = _(response.all_pages).slice(0).take(3).value();
    } else {
        response.pages = _(response.all_pages).slice(current_page-1).take(3).value();
    }
    return response
};

module.exports = {
    getSkipLimit,
    getPages
};