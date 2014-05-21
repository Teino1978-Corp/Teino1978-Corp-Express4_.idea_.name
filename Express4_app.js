var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect=require('connect');
var MongoStore=require("connect-mongo-store")(connect);
var mongoStore=new MongoStore('mongodb://localhost:27017/express4');
var log4sini=require('./syssupport/log4sini');
var log4js=log4sini.getLog4s();
var logger4s=log4js.getLogger('normal');
logger4s.setLevel('INFO');

var routes = require('./routes/index');


var app = express();
var midconnect=connect();

// 设置view的路径及模板引擎
app.set('views', path.join(__dirname, 'views'));
//修改ejs模板后缀为html
app.engine('html',require('ejs').__express);
app.set('view engine','html');//app.set('view engine', 'ejs');

//应用给定的中间件
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//指定静态文件路径前缀
app.use(express.static(path.join(__dirname, 'public')));
//指定MongoDB作为session存储介质
midconnect.use(connect.session({store:mongoStore,secret:'express4test'}));
//指定日志记录为log4js
app.use(log4js.connectLogger(logger4s,{level:log4js.levels.INFO}));

app.use(function(req,res,next){
    app.locals.user=connect.session.user;
    next();
});

app.use(function(req, res, next){
    app.locals.user = connect.session.user;
    var err=connect.session.error;
    if(connect.session.error) {
        delete connect.session.error;
    }
    app.locals.message = '';
    if (err) {
        app.locals.message = '<div class="alert alert-error">' + err + '</div>';
    }
    next();
});

app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//暴露日志api以在route中使用
exports.logger=function(name){
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}


module.exports = app;
