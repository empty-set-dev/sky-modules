<!--- This ECS Components was auto-generated using "npx sky readme" --> 

# [Sky Docs](../README.md)

[Overview](..%2Fdocs%2FOverview.md)   
**[#ECS Components](..%2F%23ecs-components%2FECS%20Components.md)**   
  
[#ECS Systems](..%2F%23ecs-systems%2FECS%20Systems.md)   
[Camera](..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FCamera.md)   
[Test](..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FTest.md)   
[Packages](..%2F%40pkgs%2FPackages.md)   
[Platform](..%2F%40platform%2FPlatform.md)   
[cameras](..%2Fcameras%2Fcameras.md)   
[components](..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2Fcrypto%2FCrypto.md)   
[Features](..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2Fhelpers%2FHelpers.md)   
[Standard](..%2Fstandard%2FStandard.md)   

# #ECS Components

## Physics3Able

```typescript
new Physics3Able(entity, 0, 0, 0)
entity.Physics3Able.acceleration = new Vector3(1, 1, 1)
entity.Physics3Able.friction = MetersPerSecond(1)
entity.Physics3Able.linearFriction = PercentsPerMillisecond(0.5)
entity.Physics3Able.velocity = new Vector3(1, 1, 1)
entity.Physics3Able.position = new Vector3(1, 1, 1)

```