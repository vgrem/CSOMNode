var XMLHttpRequestImpl = require('xmlhttprequest').XMLHttpRequest;
XMLHttpRequest = function () {
    var inst = new XMLHttpRequestImpl();
    inst.setDisableHeaderCheck(true);
    return inst;
}
