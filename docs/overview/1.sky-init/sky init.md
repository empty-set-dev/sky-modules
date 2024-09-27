<!--- This sky init was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

**[Overview](..%2F..%2F..%2Fdocs%2Foverview%2FOverview.md)**   
* **[sky init](..%2F..%2F..%2Fdocs%2Foverview%2F1.sky-init%2Fsky%20init.md)**
* [sky readme](..%2F..%2F..%2Fdocs%2Foverview%2F2.sky-readme%2Fsky%20readme.md)
* [sky desktop](..%2F..%2F..%2Fdocs%2Foverview%2Fsky-desktop%2Fsky%20desktop.md)
* [sky mobile](..%2F..%2F..%2Fdocs%2Foverview%2Fsky-mobile%2Fsky%20mobile.md)
* [sky node](..%2F..%2F..%2Fdocs%2Foverview%2Fsky-node%2Fsky%20node.md)
* [sky web](..%2F..%2F..%2Fdocs%2Foverview%2Fsky-web%2Fsky%20web.md)
  
[Platform: Node](..%2F..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Platform: Web](..%2F..%2F..%2F%40web%2FPlatform%3A%20Web.md)   
[cameras](..%2F..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2F..%2Fcrypto%2FCrypto.md)   
[ECS Components](..%2F..%2F..%2Fecs-components%2FECS%20Components.md)   
[Features](..%2F..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2F..%2Fhelpers%2FHelpers.md)   
[Standard](..%2F..%2F..%2Fstandard%2FStandard.md)   

# [Overview](..%2F..%2F..%2Fdocs%2Foverview%2FOverview.md) / sky init

# init all

`sky init`

# sky.config.ts

`sky init sky-config`

```typescript
export default {
    title: 'App Title',
    apps: {
        'app name': {
            path: '.',
            target: 'web',
            public: 'public',
        }
    },
    modules: {
        name: {
            path: 'module path',
        }
    },
    scripts: {
        some: 'some command',
    }
}

```

# tsconfig

`sky init tsconfig`

# .gitignore

`sky init gitignore`

# package.json

`sky init package`

# packages and lint configs

`sky init packages`