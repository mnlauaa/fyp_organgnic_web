const Router = require('koa-router');
const passport = require('koa-passport');
const multer = require('koa-multer');

const userCtrl = require('./controllers/user');
const authCtrl = require('./controllers/auth');
const productCrtl = require('./controllers/product');
const orderCrtl = require('./controllers/order');
const newsCtrl = require('./controllers/news');
const chatCtrl = require('./controllers/chat');


const db = require('./utils/database');


const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/user/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const userUpload = multer({ storage: userStorage })

const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/product/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const productUpload = multer({ storage: productStorage })

const receiptStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/receipt/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const receiptUpload = multer({ storage: receiptStorage })



const newsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/news/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const newsUpload = multer({ storage: newsStorage })


/* router 1 (/me) */
let me = new Router()
    .get('/', passport.authenticate('jwt', { session: false }), userCtrl.getMe)
    .get('/farm', passport.authenticate('jwt', { session: false }), userCtrl.getMeFarm)
    .get('/shopping_cart', passport.authenticate('jwt', { session: false }), orderCrtl.getMyShoppingCart)
    .get('/order', passport.authenticate('jwt', { session: false }), orderCrtl.getMyOrder)
    .get('/chat', passport.authenticate('jwt', { session: false }), chatCtrl.getMyChat)
    .get('/favourite', passport.authenticate('jwt', { session: false }), userCtrl.getFavoriteFarm)
    .get('/debt', passport.authenticate('jwt', { session: false }), orderCrtl.getMeDebts)
    .post('/', authCtrl.postSignUp)
    .post('/login', passport.authenticate('normal-login', { session: false }), authCtrl.postLogin)
    .post('/logout', passport.authenticate('normal-login', { session: false }), authCtrl.postLogout)
    .post('/fb', authCtrl.postFb)
    .post('/shopping_cart', passport.authenticate('jwt', { session: false }), orderCrtl.postMyShoppingCart)
    .post('/farm/pickup', passport.authenticate('jwt', { session: false }), userCtrl.postMeFarmPickup)
    .post('/favourite/:id', passport.authenticate('jwt', { session: false }), userCtrl.postMeFavorite)
    .put('/', passport.authenticate('jwt', { session: false }), userUpload.single('icon'), userCtrl.putMe)
    .put('/farm', passport.authenticate('jwt', { session: false }), userUpload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userCtrl.putMeFarm)
    .put('/farm/setting', passport.authenticate('jwt', { session: false }), userCtrl.putMeFarmSetting)
    .put('/farm/pickup/:id', passport.authenticate('jwt', { session: false }), userCtrl.putMeFarmPickup)
    .delete('/favourite/:id', passport.authenticate('jwt', { session: false }), userCtrl.deleteMeFavorite)

/* router 2 (/user) */
let users = new Router()
    .get('/farms', userCtrl.getFarmList)
    .get('/coupon', passport.authenticate('jwt', { session: false }), userCtrl.getAllCoupon)
    .get('/:id', userCtrl.getUserById)
    .get('/:id/farms', userCtrl.getfarmById)
    .get('/:id/farms/isFavourite', passport.authenticate('jwt', { session: false }), userCtrl.getFarmisFavorite)
    .get('/:id/farms/reviews', userCtrl.getFarmReview)
    .post('/coupon', passport.authenticate('jwt', { session: false }), userCtrl.postCoupon)
    .post('/:id/farms/reviews', passport.authenticate('jwt', { session: false }), userCtrl.postFarmReview)

let products = new Router()
    .get('/', productCrtl.getProductList)
    .get('/related', productCrtl.getRelatedProduct)
    .get('/:id', productCrtl.getProductById)
    .get('/:id/reviews', productCrtl.getProductReview)
    .get('/stat/:id', passport.authenticate('jwt', { session: false }), productCrtl.getTopSalesProducts)
    .post('/', passport.authenticate('jwt', { session: false }), productUpload.single('product'), productCrtl.postProduct)
    .put('/:id', passport.authenticate('jwt', { session: false }), productUpload.single('product'), productCrtl.putProduct)

let orders = new Router()
    .get('/buyer', passport.authenticate('jwt', { session: false }), orderCrtl.getBuyerOrder)
    .get('/seller', passport.authenticate('jwt', { session: false }), orderCrtl.getSellerOrder)
    .get('/:id',  passport.authenticate('jwt', { session: false }), orderCrtl.getOederById)
    .get('/stat/day/:id', passport.authenticate('jwt', { session: false }),orderCrtl.getOrderPerDayById)
    .get('/stat/week/:id', passport.authenticate('jwt', { session: false }),orderCrtl.getOrderPerWeekById)
    .get('/stat/monnth/:id', passport.authenticate('jwt', { session: false }),orderCrtl.getOrderPerMonthById)
    .post('/', orderCrtl.postOrder)
    .post('/:id/translation', passport.authenticate('jwt', { session: false }),  orderCrtl.postTransition)
    .put('/:id', passport.authenticate('jwt', { session: false }), receiptUpload.single('receipt'), orderCrtl.putOrder)
    .put('/translation/:id', passport.authenticate('jwt', { session: false }), orderCrtl.putTransition)
    .delete('/translation/:id', passport.authenticate('jwt', { session: false }), orderCrtl.deleteTransition)
    .delete('/:id', passport.authenticate('jwt', { session: false }), orderCrtl.deleteOrder)

let news = new Router()
    .get('/', newsCtrl.getNewsList)
    .get('/farm/:id', newsCtrl.getFramNewsList)
    .get('/:id', newsCtrl.getNewsById)
    .post('/', passport.authenticate('jwt', { session: false }), newsUpload.single('news'), newsCtrl.postNews)
    .put('/:id', passport.authenticate('jwt', { session: false }), newsUpload.single('news'), newsCtrl.putNews)
    .delete('/:id', passport.authenticate('jwt', { session: false }), newsCtrl.deleteNews)
    
let chats = new Router()
    .get('/unRead', passport.authenticate('jwt', { session: false }), chatCtrl.getChatById)
    .get('/:id', passport.authenticate('jwt', { session: false }), chatCtrl.getChatById)
    .post('/', chatCtrl.postChat)

let router = new Router()

router.use('/me', me.routes(), me.allowedMethods())
router.use('/users', users.routes(), users.allowedMethods())
router.use('/products', products.routes(), products.allowedMethods())
router.use('/orders', orders.routes(), orders.allowedMethods())
router.use('/news', news.routes(), news.allowedMethods())
router.use('/chats', chats.routes(), chats.allowedMethods())
// router.get('/',  (ctx)=>{
//     ctx.body= "hello"
// })

module.exports = router