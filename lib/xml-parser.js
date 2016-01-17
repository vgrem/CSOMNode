var xml2js = require('xml2js');

function parseXml(xml, complete) {
    var parser = new xml2js.Parser({
        emptyTag: '',  // use empty string as value when tag empty,
        explicitArray : false
    });
    parser.on('end', function (js) {
        complete && complete(js);
    });
    parser.parseString(xml);
};


exports.parseXml = parseXml;