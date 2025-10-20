/* eslint-disable */
export type Token = `colors.${ColorToken}` | `spacing.${SpacingToken}` | `fontSizes.${FontSizeToken}` | `lineHeights.${LineHeightToken}` | `letterSpacings.${LetterSpacingToken}` | `radii.${RadiusToken}` | `shadows.${ShadowToken}` | `blurs.${BlurToken}` | `sizes.${SizeToken}` | `zIndex.${ZIndexToken}` | `durations.${DurationToken}` | `opacity.${OpacityToken}` | `breakpoints.${BreakpointToken}`

export type ColorPalette = "neutral" | "brand" | "brand.primary" | "background" | "foreground" | "border" | "status" | "surface" | "effects"

export type ColorToken = "neutral.50" | "neutral.100" | "neutral.200" | "neutral.300" | "neutral.400" | "neutral.500" | "neutral.600" | "neutral.700" | "neutral.800" | "neutral.900" | "neutral.950" | "brand.primary.50" | "brand.primary.100" | "brand.primary.200" | "brand.primary.300" | "brand.primary.400" | "brand.primary.500" | "brand.primary.600" | "brand.primary.700" | "brand.primary.800" | "brand.primary.900" | "brand.primary.950" | "background.primary" | "background.secondary" | "background.tertiary" | "background.inverse" | "background.backdrop" | "background.overlay" | "background.scrim" | "foreground.primary" | "foreground.secondary" | "foreground.tertiary" | "foreground.inverse" | "foreground.disabled" | "foreground.placeholder" | "border.primary" | "border.secondary" | "border.tertiary" | "border.inverse" | "border.focus" | "border.error" | "border.warning" | "border.success" | "border.info" | "brand.primaryHover" | "brand.primaryActive" | "brand.primarySubtle" | "brand.primaryMuted" | "brand.primaryEmphasis" | "brand.secondaryHover" | "brand.secondaryActive" | "brand.secondarySubtle" | "brand.secondaryMuted" | "brand.secondaryEmphasis" | "brand.tertiaryHover" | "brand.tertiaryActive" | "brand.tertiarySubtle" | "brand.tertiaryMuted" | "brand.tertiaryEmphasis" | "status.success" | "status.successHover" | "status.successActive" | "status.successSubtle" | "status.successMuted" | "status.successEmphasis" | "status.error" | "status.errorHover" | "status.errorActive" | "status.errorSubtle" | "status.errorMuted" | "status.errorEmphasis" | "status.warning" | "status.warningHover" | "status.warningActive" | "status.warningSubtle" | "status.warningMuted" | "status.warningEmphasis" | "status.info" | "status.infoHover" | "status.infoActive" | "status.infoSubtle" | "status.infoMuted" | "status.infoEmphasis" | "surface.overlay" | "surface.selected" | "surface.disabled" | "effects.glowPrimary" | "effects.glowSecondary" | "effects.glowTertiary" | "effects.glowFocus" | "effects.glowHover" | "effects.glowActive" | "effects.glowSubtle" | "effects.glowStrong" | "effects.glowBrand" | "effects.glowSuccess" | "effects.glowError" | "effects.glowWarning" | "effects.glowInfo" | "colorPalette.50" | "colorPalette.100" | "colorPalette.200" | "colorPalette.300" | "colorPalette.400" | "colorPalette.500" | "colorPalette.600" | "colorPalette.700" | "colorPalette.800" | "colorPalette.900" | "colorPalette.950" | "colorPalette.primary.50" | "colorPalette.primary.100" | "colorPalette.primary.200" | "colorPalette.primary.300" | "colorPalette.primary.400" | "colorPalette.primary.500" | "colorPalette.primary.600" | "colorPalette.primary.700" | "colorPalette.primary.800" | "colorPalette.primary.900" | "colorPalette.primary.950" | "colorPalette.primary" | "colorPalette.secondary" | "colorPalette.tertiary" | "colorPalette.inverse" | "colorPalette.backdrop" | "colorPalette.overlay" | "colorPalette.scrim" | "colorPalette.disabled" | "colorPalette.placeholder" | "colorPalette.focus" | "colorPalette.error" | "colorPalette.warning" | "colorPalette.success" | "colorPalette.info" | "colorPalette.primaryHover" | "colorPalette.primaryActive" | "colorPalette.primarySubtle" | "colorPalette.primaryMuted" | "colorPalette.primaryEmphasis" | "colorPalette.secondaryHover" | "colorPalette.secondaryActive" | "colorPalette.secondarySubtle" | "colorPalette.secondaryMuted" | "colorPalette.secondaryEmphasis" | "colorPalette.tertiaryHover" | "colorPalette.tertiaryActive" | "colorPalette.tertiarySubtle" | "colorPalette.tertiaryMuted" | "colorPalette.tertiaryEmphasis" | "colorPalette.successHover" | "colorPalette.successActive" | "colorPalette.successSubtle" | "colorPalette.successMuted" | "colorPalette.successEmphasis" | "colorPalette.errorHover" | "colorPalette.errorActive" | "colorPalette.errorSubtle" | "colorPalette.errorMuted" | "colorPalette.errorEmphasis" | "colorPalette.warningHover" | "colorPalette.warningActive" | "colorPalette.warningSubtle" | "colorPalette.warningMuted" | "colorPalette.warningEmphasis" | "colorPalette.infoHover" | "colorPalette.infoActive" | "colorPalette.infoSubtle" | "colorPalette.infoMuted" | "colorPalette.infoEmphasis" | "colorPalette.selected" | "colorPalette.glowPrimary" | "colorPalette.glowSecondary" | "colorPalette.glowTertiary" | "colorPalette.glowFocus" | "colorPalette.glowHover" | "colorPalette.glowActive" | "colorPalette.glowSubtle" | "colorPalette.glowStrong" | "colorPalette.glowBrand" | "colorPalette.glowSuccess" | "colorPalette.glowError" | "colorPalette.glowWarning" | "colorPalette.glowInfo"

export type SpacingToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "-xs" | "-sm" | "-md" | "-lg" | "-xl" | "-2xl" | "-3xl" | "-4xl" | "-5xl" | "-6xl" | "-7xl" | "-8xl" | "-9xl"

export type FontSizeToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl"

export type LineHeightToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "tight" | "snug" | "normal" | "relaxed" | "loose"

export type LetterSpacingToken = "tighter" | "tight" | "normal" | "wide" | "wider" | "widest"

export type RadiusToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"

export type ShadowToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

export type BlurToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

export type SizeToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl" | "breakpoint-sm" | "breakpoint-md" | "breakpoint-lg" | "breakpoint-xl" | "breakpoint-2xl"

export type ZIndexToken = "dropdown" | "sticky" | "fixed" | "modal" | "popover" | "tooltip" | "toast" | "overlay"

export type DurationToken = "instant" | "micro" | "short" | "base" | "moderate" | "long" | "extended"

export type OpacityToken = "disabled" | "subtle" | "medium" | "visible" | "hidden" | "overlay" | "backdrop"

export type BreakpointToken = "sm" | "md" | "lg" | "xl" | "2xl"

export type Tokens = {
		colors: ColorToken
		spacing: SpacingToken
		fontSizes: FontSizeToken
		lineHeights: LineHeightToken
		letterSpacings: LetterSpacingToken
		radii: RadiusToken
		shadows: ShadowToken
		blurs: BlurToken
		sizes: SizeToken
		zIndex: ZIndexToken
		durations: DurationToken
		opacity: OpacityToken
		breakpoints: BreakpointToken
} & { [token: string]: never }

export type TokenCategory = "aspectRatios" | "zIndex" | "opacity" | "colors" | "fonts" | "fontSizes" | "fontWeights" | "lineHeights" | "letterSpacings" | "sizes" | "cursor" | "shadows" | "spacing" | "radii" | "borders" | "borderWidths" | "durations" | "easings" | "animations" | "blurs" | "gradients" | "breakpoints" | "assets"