import Three from 'pkgs/three';
import globalify from '@sky-modules/core/globalify';
var lib;
(function (lib) {
    class Renderer extends Three.WebGLRenderer {
        constructor(deps, targetOfContext, parameters) {
            super({
                premultipliedAlpha: true,
                antialias: true,
                ...parameters,
            });
            this.effect = new Effect(deps, this);
            targetOfContext.addContext(Renderer, this);
            this.pixelRatio = parameters.pixelRatio;
            this.toneMappingExposure = 1.0;
            if (parameters.disableShadows !== false) {
                this.shadowMap.enabled = true;
                this.shadowMap.type = Three.PCFSoftShadowMap;
            }
            this.size = parameters.size;
            {
                const [w, h] = parameters.size();
                this.setSize(w * this.pixelRatio, h * this.pixelRatio, false);
            }
            new WindowEventListener('resize', () => {
                const [w, h] = parameters.size();
                this.setSize(w * this.pixelRatio, h * this.pixelRatio, false);
            }, this.effect);
        }
    }
    lib.Renderer = Renderer;
})(lib || (lib = {}));
globalify.namespace('Sky', lib);
//# sourceMappingURL=Sky.Renderer.js.map