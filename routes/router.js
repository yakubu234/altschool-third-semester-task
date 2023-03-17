const express = require('express');
const router = express.Router();
const NewController = require('../app/controllers/NewController');
router.get('get/details', NewController.create);
router.post('post/details/:id([0-9]+)', NewController.authenticate);
module.exports = router;