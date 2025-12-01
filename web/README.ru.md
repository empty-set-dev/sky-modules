# @sky-modules/web

#B8;8BK 4;O @01>BK A 251-?;0BD>@<>9 8 1@0C75@=K<8 2>7<>6=>ABO<8.

## #AB0=>2:0

```bash
npm install @sky-modules/web
```

## >7<>6=>AB8

- >=AB0=BK HTML B53>2 4;O 20;840F88
- ?@545;5=85 iOS CAB@>9AB2 (2:;NG0O iPadOS)
- ?@545;5=85 A5=A>@=KE CAB@>9AB2 G5@57 <5480-70?@>AK

## A?>;L7>20=85

### HTML B538

>;=K9 A?8A>: AB0=40@B=KE HTML5 B53>2:

```ts
import HTML_TAGS from '@sky-modules/web/HTML_TAGS'

const isValidTag = (tag: string) => HTML_TAGS.includes(tag)
console.log(isValidTag('div')) // true
console.log(isValidTag('custom')) // false

// 5@51>@ 2A5E B53>2
HTML_TAGS.forEach(tag => console.log(tag))
```

**;>10;L=>5 8A?>;L7>20=85:**

```ts
import '@sky-modules/web/global'

HTML_TAGS.forEach(tag => console.log(tag))
```

### ?@545;5=85 iOS

?@545;5=85 iOS CAB@>9AB2 2:;NG0O iPadOS:

```ts
import isIos, { getIosVersion } from '@sky-modules/web/helpers/isIos'

if (isIos()) {
  // >2545=85 A?5F8D8G=>5 4;O iOS
  enableIOSScrollFix()
}

const version = getIosVersion()
if (version && version >= 15) {
  // >7<>6=>AB8 iOS 15+
}
```

**;>10;L=>5 8A?>;L7>20=85:**

```ts
import '@sky-modules/web/helpers/global'

if (isIos()) {
  // >ABC?=> 3;>10;L=>
}
```

### ?@545;5=85 A5=A>@=KE CAB@>9AB2

?@545;5=85 CAB@>9AB2 A A5=A>@=K< 22>4><:

```ts
import { isTouchDevice } from '@sky-modules/web/helpers/isTouchDevice'

if (isTouchDevice()) {
  // :;NG8BL 8=B5@D59A 4;O A5=A>@=KE M:@0=>2
  increaseTouchTargetSizes()
} else {
  // :;NG8BL MDD5:BK =02545=8O 4;O <KH8
  enableHoverEffects()
}
```

**;>10;L=>5 8A?>;L7>20=85:**

```ts
import '@sky-modules/web/helpers/global'

if (isTouchDevice()) {
  // >ABC?=> 3;>10;L=>
}
```

## API

### HTML_TAGS

0AA82 2A5E AB0=40@B=KE 8<5= HTML5 M;5<5=B>2.

**0B53>@88:**
- 5B040==K5 4>:C<5=B0
- !5:F8>=8@>20=85 :>=B5=B0
- "5:AB>2K9 :>=B5=B
- AB@>5==0O B5:AB>20O A5<0=B8:0
- 7>1@065=8O 8 <C;LB8<5480
- AB@08205<K9 :>=B5=B
- !:@8?BK
- "01;8G=K9 :>=B5=B
- $>@<K
- =B5@0:B82=K5 M;5<5=BK
- 51-:><?>=5=BK

### isIos()

>72@0I05B `true` 5A;8 2K?>;=O5BAO =0 iOS CAB@>9AB25 (iPhone, iPad, iPod, iPadOS).

**?@545;5=85:**
- @>25@O5B user agent =0 iPhone/iPad/iPod
- ?@545;O5B iPadOS (MacIntel A ?>445@6:>9 A5=A>@0)

### getIosVersion()

>72@0I05B <06>@=CN 25@A8N iOS 8;8 `null` 5A;8 =5 iOS.

### isTouchDevice()

>72@0I05B `true` 5A;8 CAB@>9AB2> 8A?>;L7C5B A5=A>@=K9 22>4 :0: >A=>2=>9.

**?@545;5=85:**
- A?>;L7C5B <5480-70?@>A `(pointer: coarse)`
- 0456=55 G5< `ontouchstart` 8;8 `maxTouchPoints`

## 5B0;8 @50;870F88

- A5 E5;?5@K 4>ABC?=K 3;>10;L=> G5@57 8<?>@BK `global/`
- ?@545;5=85 iOS >1@010BK205B iPadOS <0A:8@CNI89AO ?>4 MacIntel
- ?@545;5=85 A5=A>@0 8A?>;L7C5B pointer <5480-70?@>A 4;O B>G=>AB8
- HTML_TAGS 2:;NG05B 2A5 AB0=40@B=K5 M;5<5=BK 4> HTML5

## !2O70==K5 <>4C;8

- [@sky-modules/platform](../platform/) - ?@545;5=85 ?;0BD>@<K
- [@sky-modules/universal](../universal/) - #=825@A0;L=K5 :><?>=5=BK
