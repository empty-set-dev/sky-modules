<!--- This ECS Components was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../README.md)

[Commands](..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2Fstandard%2FREADME.md)   
[Platform](..%2Fplatform%2FREADME.md)   
[Utilities](..%2Futilities%2FREADME.md)   
[Helpers](..%2Fhelpers%2FREADME.md)   
[Packages](..%2Fpkgs%2FREADME.md)   
[cameras](..%2Fcameras%2FREADME.md)   
[components](..%2Fcomponents%2FREADME.md)   
[Crypto](..%2Fcrypto%2FREADME.md)   
**[ECS Components](..%2Fecs%2FREADME.md)**   
  
[Features](..%2Ffeatures%2FREADME.md)   

## ECS Components [(Source)](..%2Fecs%2F)

  
### Physics3

```ts
entity.physics3.acceleration = new Vector3(1, 1, 1)
entity.physics3.friction = MetersPerSecond(1)
entity.physics3.linearFriction = PercentsPerMillisecond(0.5)
entity.physics3.velocity = new Vector3(1, 1, 1)
entity.physics3.position = new Vector3(1, 1, 1)

```

#### System Physics3System

[source code](Physics3System.ts)