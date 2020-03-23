(function () {
    var origRegisterInterface = Type.prototype.registerInterface;
    Type.prototype.registerInterface = function (typeName) {
        if (typeName == "IEnumerator" || typeName == "IEnumerable" || typeName == "IDisposable") {
            if (global[typeName]) {
                this.prototype.constructor = this;
                this.__typeName = typeName;
                this.__interface = true;
                return this;
            }
            global[typeName] = this;
        }
        return origRegisterInterface.apply(this, [].slice.call(arguments));
    };
})();
