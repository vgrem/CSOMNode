var http = require('http'),
    https = require('https');



function getRequest(host, path, headers, callback) {
    var options = {
        host: host,
        path: path,
        method: 'GET',
        headers: headers
    };
    
    https.get(options, function (response) {
        var body = "";
        response.on('data', function (d) {
            body += d;
        });
        response.on('end', function () {
            callback(body);
        });
        response.on('error', function (e) {
            callback(null);
        });
    });
}

function postRequest(host, path, headers, postData, callback) {
    //var protocol = (ssl ? https : http);
    var options = {
        method: 'POST',
        host: host,
        path: path,
        headers: {
            'Content-Length': postData.length
        }
    };
    
    
    var post = https.request(options, function (res) {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            callback(res,data);
        });
    });
    post.end(postData);
}


function parseCookies(response) {
    var allCookies = {};
    response.headers['set-cookie'].forEach(function (items) {
        items.split('; ').forEach(function (item) {
            var parts = item.split('=');
            allCookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    });
    return allCookies;
}

exports.request = {
    post: postRequest,
    get: getRequest
};

exports.response = {
    parseCookies: parseCookies
};
