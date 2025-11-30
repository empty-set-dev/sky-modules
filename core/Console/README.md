# Console

Enhanced console with colored output and semantic logging methods.

## Installation

```typescript
import Console from '@sky-modules/core/Console'
```

## API

### Console.log(...args)

Standard log with info icon.

```typescript
Console.log(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

### Console.info(...args)

Info message with magenta color and icon.

```typescript
Console.info(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

### Console.success(...args)

Success message with green color and checkmark.

```typescript
Console.success(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

### Console.debug(...args)

Debug message with gray color and icon.

```typescript
Console.debug(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

### Console.warn(...args)

Warning message with yellow color and icon.

```typescript
Console.warn(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

### Console.error(...args)

Error message with red color and icon.

```typescript
Console.error(...args: any[]): void
```

**Parameters:**
- `args` - Values to log

## Usage

### Basic Logging

```typescript
Console.log('Application started')
Console.info('Configuration loaded')
Console.success('Database connected')
Console.debug('Processing request', { id: 123 })
Console.warn('Deprecated API used')
Console.error('Failed to connect', error)
```

### Server vs Client

```typescript
// Server (Node.js): ANSI color codes
// Client (Browser): CSS color styles
Console.success('Works everywhere!')
```
