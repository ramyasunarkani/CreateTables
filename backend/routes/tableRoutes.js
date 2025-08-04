const express = require('express');
const router = express.Router();
const controller = require('../controllers/tableController');

router.post('/create', controller.createTable);

router.get('/all', controller.listTables);
router.get('/structure/:tableName', controller.getTableStructure);
router.get('/records/:tableName', controller.getAllRecords);
router.post('/insert/:tableName', controller.insertRecord);
router.delete('/delete/:tableName/:id', controller.deleteRecord);

module.exports = router;
