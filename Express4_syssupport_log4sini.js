/**
 * Created by Administrator on 2014-05-21.
 */
var log4js = require('log4js');
log4js.configure({
        appenders: [
            { type: 'console' }, //控制台输出
            {
                type: 'file', //文件输出
                filename: 'logs/access.log',
                maxLogSize: 1024,
                backups:0,
                category: 'normal'
            }
        ],
        replaceConsole:true
});
exports.getLog4s=function(){
    return log4js;
};
exports.getLogger=function(name){
    var logger4s=log4js.getLogger(name);
    logger4s.setLevel('INFO');
    return logger4s;
};
