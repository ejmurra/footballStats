var express = require('express');
var router = require('express').Router();
var path = require('path');

router.get('/', function(req,res){
    res.sendFile(path.resolve(__dirname+'/../layouts/app.html'));
});

router.use(express.static(__dirname + '/../assets'));
router.use(express.static(__dirname + '/../templates'));

module.exports = router;