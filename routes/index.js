const router = require('express').Router();
const productController = require('../controllers/product');
const userController = require('../controllers/users')

// dashboard
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/products', async (req, res) => { productController.getProductList(req, res) });
router.get('/products/:product_id', async (req, res) => { productController.getProductDetail(req, res) });

router.get('/users', async (req, res) => { userController.getUsersList(req, res) });
router.get('/user/:id/products', async (req, res) => { userController.getUserProductList(req, res) });
router.get('/user/:id/products/:product_id', async (req, res) => { userController.getUserProductDetail(req, res) });
router.get('/user/:id/addProduct', async (req, res) => { userController.getUserProductForm(req, res) });
router.post('/user/:id/addProduct', async (req, res) => { userController.addUserProduct(req, res) });
router.get('/user/:id/editProduct/:product_id', async (req, res) => { userController.getUserEditProductForm(req, res) });
router.post('/user/:id/editProduct/:product_id', async (req, res) => { userController.editUserProduct(req, res) });

module.exports = router;