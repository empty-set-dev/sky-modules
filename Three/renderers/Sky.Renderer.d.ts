import Three from 'pkgs/three';
declare global {
    namespace Sky {
        interface RendererParameters extends lib.RendererParameters {
        }
        class Renderer extends lib.Renderer {
        }
    }
}
declare namespace lib {
    interface RendererParameters extends Three.WebGLRendererParameters {
        size: () => [number, number];
        pixelRatio: number;
        disableShadows?: boolean;
    }
    class Renderer extends Three.WebGLRenderer {
        static context: true;
        readonly effect: Effect;
        size: () => [number, number];
        readonly pixelRatio: number;
        constructor(deps: EffectDeps, targetOfContext: Effect | EffectRoot, parameters: RendererParameters);
    }
}
export {};
//# sourceMappingURL=Sky.Renderer.d.ts.map