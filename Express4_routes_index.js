var express = require('express');
var connect=require('connect');
var router = express.Router();
var logger=require('../syssupport/log4sini').getLogger('index');
/* GET home page. */
router.get('/', function(req, res) {
  logger.info('This is an index page--log4js');
  res.render('index', { title: 'Express' });
});
router.get('/login',function(req,res){
    res.render('login',{title:'用户登录'});
});
router.post('/login',function(req,res){
    var user={
        username:'admin',
        password:'admin'
    };
    if(req.body.username===user.username&&req.body.password===user.password){
        connect.session.user=user;
        res.redirect('/home');
    }else{
        connect.session.error='用户名或密码不正确';
        res.redirect('/login');
    };
});
router.get('/logout',function(req,res){
    connect.session.user=null;
    res.redirect('/');
});
router.get('/home',function(req,res){
    if(!connect.session.user){
        connect.session.error='请先登录!';
        res.redirect('/login');
    }else{
        res.render('home',{title:'Home'});
    }
});

module.exports = router;
