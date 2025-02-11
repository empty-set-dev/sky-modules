<!--- This ECS Components was auto-generated using "npx sky readme" --> 

# [Sky Docs](../README.md)

[Commands](..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2Fstandard%2FREADME.md)   
[Helpers](..%2Fhelpers%2FREADME.md)   
**[#ECS Components](..%2F%23ecs-components%2FREADME.md)**   
  
[#ECS Systems](..%2F%23ecs-systems%2FREADME.md)   
[Cameras](..%2Fcameras%2FREADME.md)   
[Components](..%2Fcomponents%2FREADME.md)   
[Crypto](..%2Fcrypto%2FREADME.md)   
[Features](..%2Ffeatures%2FREADME.md)   
[Packages](..%2Fpkgs%2FREADME.md)   
[Platform](..%2Fplatform%2FREADME.md)   

## #ECS Components [(Source)](..%2F%23ecs-components%2F)

  
## Physics3Able

```typescript
const physics3 = new Physics3Component(entity, 0, 0, 0)
entity.Physics3Able.acceleration = new Vector3(1, 1, 1)
entity.Physics3Able.friction = MetersPerSecond(1)
entity.Physics3Able.linearFriction = PercentsPerMillisecond(0.5)
entity.Physics3Able.velocity = new Vector3(1, 1, 1)
entity.Physics3Able.position = new Vector3(1, 1, 1)

```