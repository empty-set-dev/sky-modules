<!--- This cn was auto-generated using "npx sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   
**[Helpers](..%2F..%2Fhelpers%2FREADME.md)**   
* **[cn](..%2F..%2Fhelpers%2FclassNames%2FREADME.md)**
* [EventEmitter](..%2F..%2Fhelpers%2FEventEmitter%2FREADME.md)
* [globalify](..%2F..%2Fhelpers%2Fglobalify%2FREADME.md)
* [idle](..%2F..%2Fhelpers%2Fidle%2FREADME.md)
* [Loop](..%2F..%2Fhelpers%2FLoop%2FREADME.md)
* [PromisesPool](..%2F..%2Fhelpers%2FPromisesPool%2FREADME.md)
* [times](..%2F..%2Fhelpers%2Ftimes%2FREADME.md)
  
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   

## [Helpers](..%2F..%2Fhelpers%2FREADME.md) / cn [(Source)](..%2F..%2Fhelpers%2FclassNames%2F)

  
### _function_ cn`<T extends Record<string, string>>`(block?: string, styles?: T): Cx

```tsx
import styles from './ComponentName.scss'
const cx = cn('[ComponentName]', styles)

export default ComponentName() {
    return (
        <div className={cx`[ComponentName]`}>
            <div className={cx`e:content`}>Content</div>
        </div>
    )
}

```