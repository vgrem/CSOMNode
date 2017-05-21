var fs = require('fs'),
    qs = require('querystring'),
    xml2js = require('xml2js'),
    http = require('http'),
    https = require('https'),
    urlparse = require('url').parse,
    parseXml = require('../xml-parser.js').parseXml,
    response = require('../request-utilities.js').response,
    request = require('../request-utilities.js').request,
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;



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
        if (self.FedAuth) {
            var authCookie = 'FedAuth=' + self.FedAuth + '; rtFa=' + self.rtFa;
            headers['Cookie'] = authCookie;
        } else {
            headers['Authorization'] = "Bearer " + self.appAccessToken;
        }
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

function acquireTokenForApp(clientId, clientSecret, callback) {
    var self = this;
    
    getRealm(self, (err, realm) => {
        if (err) {
            callback(err);
            return;
        }

        authenticateApp(self, realm, clientId, clientSecret, (err, access_token) => {
            if (err) {
                callback(err);
                return;
            }

            self.appAccessToken = access_token;
            callback(null, {});
        });
    });
}

function getRealm(self, callback) {
    ajaxPost(self.url.href + "_vti_bin/client.svc", { "Authorization": "Bearer " }, "").then(xmlhttp => {
        var wwwAuthHeader = xmlhttp.getResponseHeader("WWW-Authenticate");
        if (!wwwAuthHeader)
            callback("Error retrieving realm: " + xmlhttp.responseText, null);
        else {
            var realm = wwwAuthHeader.split(",")[0].split("=")[1].slice(1, -1);
            callback(null, realm);
        }
    });
}

function authenticateApp(self, realm, clientId, clientSecret, callback) {
    var oauthUrl = "https://accounts.accesscontrol.windows.net/" + realm + "/tokens/OAuth/2";
    var redirecturi = "https://localhost"
    var appResource = "00000003-0000-0ff1-ce00-000000000000"

    var body = "grant_type=client_credentials";
    body += "&client_id=" + clientId + "@" + realm;
    body += "&client_secret=" + clientSecret;
    body += "&redirect_uri=" + redirecturi;
    body += "&resource=" + appResource + "/" + self.url.hostname + "@" + realm;

    var headers = { "Content-Type": "application/x-www-form-urlencoded" };

    ajaxPost(oauthUrl, headers, body).then(xmlhttp => {
        var access_token = JSON.parse(xmlhttp.responseText).access_token;
        callback(access_token ? null : xmlhttp.responseText, access_token)
    });
}

function ajaxPost(url, headers, body) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 ) {
                resolve(xmlhttp);
            }
        };
        xmlhttp.open("POST", url, true);
        for (var k in headers)
            xmlhttp.setRequestHeader(k, headers[k]);
        xmlhttp.send(body);
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
    acquireTokenForApp: acquireTokenForApp,
    setAuthenticationCookie: setAuthenticationCookie, 
    requestFormDigest : requestFormDigest
};


module.exports = AuthenticationContext;