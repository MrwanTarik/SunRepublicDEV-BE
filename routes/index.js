const router = require('express').Router();
const unhandledRejectionHandler = require('../helpers/unhandledRejectionHandler');
const auth = require('./auth');
const property = require('./property');
const blogPosts = require('./blog-posts');
const admin = require('./admin');
const contact = require('./contact');

router.all('*', unhandledRejectionHandler);
router.use('/', auth);
router.use('/property', property);
router.use('/blog-posts', blogPosts);
router.use('/admin', admin);
router.use('/contact', contact);

module.exports = router;
