<!--- This ECS Components was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

[Overview](..%2Fdocs%2Foverview%2FOverview.md)   
[Platform: Node](..%2F%40node%2FPlatform%3A%20Node.md)   
[Platform: Web](..%2F%40web%2FPlatform%3A%20Web.md)   
[cameras](..%2Fcameras%2Fcameras.md)   
[components](..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2Fcrypto%2FCrypto.md)   
**[ECS Components](..%2Fecs-components%2FECS%20Components.md)**   
  
[Features](..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2Fhelpers%2FHelpers.md)   
[Standard](..%2Fstandard%2FStandard.md)   

# ECS Components

## Physics3Able

```typescript
new Physics3Able(entity, 0, 0, 0)
entity.Physics3Able.acceleration = new Vector3(1, 1, 1)
entity.Physics3Able.friction = MetersPerSecond(1)
entity.Physics3Able.linearFriction = PercentsPerMillisecond(0.5)
entity.Physics3Able.velocity = new Vector3(1, 1, 1)
entity.Physics3Able.position = new Vector3(1, 1, 1)

```