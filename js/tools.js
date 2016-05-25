var tools = (function () {

    var module = {};

    module.loadShaderSource = function (elementId) {
        var element = document.getElementById(elementId);

        if (element == null) {
            throw new Error("Elemento shader não encontrado.");
        }

        return element.text;
    };

    return module;

})();
