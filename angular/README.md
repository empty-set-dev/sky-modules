# Angular Adapter

Angular platform components and utilities for Sky Modules.

## Overview

The Angular adapter provides Angular-specific implementations of universal components compiled via Mitosis. Use this package to integrate Sky Modules components in Angular applications.

## Installation

```bash
npm install @sky-modules/angular @angular/core
```

## Features

- **Universal Components** - Angular implementations of Sky Modules components
- **Mitosis-compiled** - Automatically generated from universal component definitions
- **Type-safe** - Full TypeScript support
- **Zone.js compatible** - Works with Angular change detection

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core'
import { SkyComponent } from '@sky-modules/angular'

@Component({
  selector: 'app-root',
  template: `
    <sky-component>
      Content goes here
    </sky-component>
  `
})
export class AppComponent {}
```

## Component Compilation

Components in this package are compiled from Mitosis (`.lite.tsx`) source files located in the `universal/` directory. The compilation happens automatically during build.

**Build process:**
```bash
# Compile Mitosis components to Angular
sky mitosis build <app-name>
```

## Peer Dependencies

- `@angular/core` ^16.0.0 || ^17.0.0 || ^18.0.0

## Architecture

The Angular adapter is part of the Sky Modules cross-framework component system:
1. Universal components defined in Mitosis
2. Compiled to Angular during build
3. Published as Angular-compatible package

## Module Import

```typescript
import { NgModule } from '@angular/core'
import { SkyModulesModule } from '@sky-modules/angular'

@NgModule({
  imports: [
    SkyModulesModule
  ]
})
export class AppModule {}
```

## Related Modules

- [@sky-modules/universal](../universal/) - Universal component definitions
- [@sky-modules/react](../react/) - React adapter
- [@sky-modules/vue](../vue/) - Vue adapter
- [@sky-modules/solid](../solid/) - Solid adapter

## Examples

See the [playground](../../playground/) directory for complete examples.
