function Core (canvasId) {
    this.coreState = {};
    this.state = {};

    this.coreState.canvasId = canvasId;
}

Core.prototype.init = function (initCallback) {
    this.coreState.canvasElement = document.getElementById(this.coreState.canvasId);
    if (this.coreState.canvasElement == null) {
        throw new Error('Não foi possível encontrar o elemento Canvas.');
    }

    this.coreState.canvasContext = this.coreState.canvasElement.getContext('webgl');
    if (this.coreState.canvasContext == null) {
        throw new Error('Não foi possível obter o contexto do WebGL.');
    }

    initCallback && initCallback();
};

Core.prototype.setUpdateCallback = function (updateCallback) {
    this.updateCallback = updateCallback;
};

Core.prototype.setDrawCallback = function (drawCallback) {
    this.drawCallback = drawCallback;
};
