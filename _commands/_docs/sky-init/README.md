<!--- This sky init.1 was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../../README.md)

**[Commands](..%2F..%2F..%2F%5Fcommands%2FREADME.md)**   
* **[sky init](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-init%2FREADME.md)**
* [sky readme](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-readme%2FREADME.md)
* [sky desktop](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-desktop%2FREADME.md)
* [sky mobile](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-mobile%2FREADME.md)
* [sky node](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-node%2FREADME.md)
* [sky web](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-web%2FREADME.md)
  
[Standard](..%2F..%2F..%2Fstandard%2FREADME.md)   
[Platform](..%2F..%2F..%2Fplatform%2FREADME.md)   
[Utilities](..%2F..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2F..%2Fecs%2FREADME.md)   
[Features](..%2F..%2F..%2Ffeatures%2FREADME.md)   

## [Commands](..%2F..%2F..%2F%5Fcommands%2FREADME.md): sky init [(Source)](..%2F..%2F..%2F%5Fcommands%2F%5Fdocs%2Fsky-init%2F)

  
### init all

```sh
sky init

```

### Sky Config (sky.config.ts)

```sh
sky init sky-config

```

```ts
export default {
    title: 'App Title',
    modules: {
        name: {
            path: 'node_modules/#MODULE_PATH',
        },
    },
    examples: {
        name: {
            path: 'example path',
        },
    },
    apps: {
        'app name': {
            target: 'web',
            public: 'public',
        },
    },
    scripts: {
        some: 'some command',
    },
}

```

### ts configs

```sh
sky init ts-configs

```

### .gitignore

```sh
sky init gitignore

```

### package.json

```sh
sky init package

```

### packages, lint and other configs

```sh
sky init packages

```

---

### init vscode workspace tasks

```sh
sky init vscode-workspace-tasks

```