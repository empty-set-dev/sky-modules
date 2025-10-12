// #/setup.ts

// ============================================
// Platform & Core
// ============================================
import '@sky-modules/platform/universal'
import '@sky-modules/core/global'

// ============================================
// Features
// ============================================
import '@sky-modules/features/effect/global'

// ============================================
// Design System - Components
// ============================================
import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

// ============================================
// Design System - Styles
// ============================================
import '@sky-modules/design/index.css'
import '@sky-modules/design/plugins/tailwind.css'
import '@sky-modules/design/tailwind-tokens.css'

// ============================================
// Framework Integration
// ============================================
import '@sky-modules/react-global'
import '@sky-modules/react/Box.implementation'
import '@sky-modules/canvas/jsx'

// ============================================
// Application Configuration
// ============================================
import '#defines/sky.playground.universal'

// ============================================
// Fonts
// ============================================
import '@/fonts/cabinet-grotesk/cabinet-grotesk.css'

// ============================================
// App Styles
// ============================================
import '#pandacss/styles.css'
import './brand.css'
