const { model} = require('mongoose');

const { OrdersSchema } = require('../schemas/OrdersSchemas');    

const OrdersModel = new model('Orders', OrdersSchema);

module.exports = { OrdersModel };