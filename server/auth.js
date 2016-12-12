var auth = require('basic-auth'),
    admins = {
        'prototype': {
            password: 't3ster'
        },
    };
module.exports = function (req, res, next) {
    'use strict';
    var user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send();
    }
    return next();
};
