export function getShaderSource (elementId) {
    var element = document.getElementById(elementId);

    if (element == null) {
        throw new Error("Elemento shader não encontrado.");
    }

    return element.text;
}
