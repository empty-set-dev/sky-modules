<!--- This ECS Components was auto-generated using "npx sky readme" --> 

# [Sky Docs](../README.md)

[Overview](..%2Fdocs%2FREADME.md)   
**[#ECS Components](..%2F%23ecs-components%2FREADME.md)**   
  
[#ECS Systems](..%2F%23ecs-systems%2FREADME.md)   
[Packages](..%2F%40pkgs%2FREADME.md)   
[Platform](..%2F%40platform%2FREADME.md)   
[Camera](..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FREADME.md)   
[Test](..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FREADME.md)   
[cameras](..%2Fcameras%2FREADME.md)   
[components](..%2Fcomponents%2FREADME.md)   
[Crypto](..%2Fcrypto%2FREADME.md)   
[Features](..%2Ffeatures%2FREADME.md)   
[Helpers](..%2Fhelpers%2FREADME.md)   
[Standard](..%2Fstandard%2FREADME.md)   

# #ECS Components [(Source)](..%2F%23ecs-components%2F)

## Physics3Able

```typescript
new Physics3Able(entity, 0, 0, 0)
entity.Physics3Able.acceleration = new Vector3(1, 1, 1)
entity.Physics3Able.friction = MetersPerSecond(1)
entity.Physics3Able.linearFriction = PercentsPerMillisecond(0.5)
entity.Physics3Able.velocity = new Vector3(1, 1, 1)
entity.Physics3Able.position = new Vector3(1, 1, 1)

```