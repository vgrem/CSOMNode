var fs = require('fs'),
    qs = require('querystring'),
    xml2js = require('xml2js'),
    http = require('http'),
    https = require('https'),
    urlparse = require('url').parse,
    parseXml = require('../xml-parser.js').parseXml,
    response = require('../request-utilities.js').response,
    request = require('../request-utilities.js').request;



var prepareSamlMessage = function (params) {
    var key;
    var saml = fs.readFileSync(__dirname + '/SAML.xml', 'utf8');
    for (key in params) {
        saml = saml.replace('[' + key + ']', params[key]);
    }
    return saml;
}





function getServiceToken(params, callback) {
    var samlMessage = prepareSamlMessage({
        username: params.username,
        password: params.password,
        endpoint: params.endpoint
    });
    
    request.post(params.sts.host, params.sts.path, null, samlMessage, function (res, data) {
        
        parseXml(data, function (json) {
            
            // check for errors
            if (json['S:Envelope']['S:Body']['S:Fault']) {
                var error = json['S:Envelope']['S:Body']['S:Fault']['S:Detail']['psf:error']['psf:internalerror']['psf:text'];
                callback(error);
                return;
            }
            
            // extract token
            var token = json['S:Envelope']['S:Body']['wst:RequestSecurityTokenResponse']['wst:RequestedSecurityToken']['wsse:BinarySecurityToken']['_'];
            callback(null, { securitytoken: token });
        });
    });
}


function setAuthenticationCookie(clientContext) {
    var self = this;
    clientContext.add_executingWebRequest(function (sender, e) {
        var headers = e.get_webRequest().get_headers();
        var authCookie = 'FedAuth=' + self.FedAuth + '; rtFa=' + self.rtFa;
        headers['Cookie'] = authCookie;
    });
}



function getAuthenticationCookie(params, callback) {
    var token = params.token,
        url = urlparse(params.endpoint);
    
    request.post(url.hostname, url.path, null, token, function (res, data) {
        var cookies = response.parseCookies(res);
        
        callback(null, {
            FedAuth: cookies.FedAuth,
            rtFa: cookies.rtFa
        });
    });
}




function acquireTokenForUser(username, password, callback) {
    var self = this;
    
    var options = {
        username: username,
        password: password,
        sts: self.sts,
        endpoint: self.url.protocol + '//' + self.url.hostname + self.login
    }
    
    getServiceToken(options, function (err, data) {
        
        if (err) {
            callback(err);
            return;
        }

        options.token = data.securitytoken;
        getAuthenticationCookie(options, function (err, data) {
            self.FedAuth = data.FedAuth;
            self.rtFa = data.rtFa;
            callback(null, {});
        });
    });
}


function requestFormDigest(username, password, callback) {
    throw new Error('requestFormDigest function is not implemented');
}






/**
 * Creates a new AuthenticationContext object.  
 * @constructor
 * @param {string}  url            A URL that identifies a web site.
 *
 */
AuthenticationContext = function (url) {
    this.url = urlparse(url);
    this.host = this.url.host;
    this.path = this.url.path;
    this.protocol = this.url.protocol;
    
    
    // External Security Token Service for SPO
    this.sts = {
        host: 'login.microsoftonline.com',
        path: '/extSTS.srf'
    };
    
    // Sign in page url
    this.login = '/_forms/default.aspx?wa=wsignin1.0';
};

AuthenticationContext.prototype = {
    acquireTokenForUser: acquireTokenForUser,
    setAuthenticationCookie: setAuthenticationCookie, 
    requestFormDigest : requestFormDigest
};


module.exports = AuthenticationContext;