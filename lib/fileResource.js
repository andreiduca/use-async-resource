"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function image(imageSrc) {
    return new Promise((resolve, reject) => {
        const file = new Image();
        file.onload = () => {
            resolve(imageSrc);
        };
        file.onerror = reject;
        file.src = imageSrc;
    });
}
exports.image = image;
function script(scriptSrc) {
    return new Promise((resolve, reject) => {
        const file = document.createElement('script');
        file.onload = () => {
            resolve(scriptSrc);
        };
        file.onerror = reject;
        file.src = scriptSrc;
        document.getElementsByTagName('body')[0].appendChild(file);
    });
}
exports.script = script;
//# sourceMappingURL=fileResource.js.map