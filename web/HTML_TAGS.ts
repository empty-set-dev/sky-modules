/**
 * Comprehensive list of all standard HTML tags
 *
 * Includes all valid HTML5 elements organized by category:
 * - Document metadata
 * - Content sectioning
 * - Text content
 * - Inline text semantics
 * - Image and multimedia
 * - Embedded content
 * - Scripting
 * - Table content
 * - Forms
 * - Interactive elements
 * - Web Components
 *
 * Useful for validation, autocomplete, or programmatic HTML generation.
 *
 * @example
 * ```ts
 * import HTML_TAGS from '@sky-modules/web/HTML_TAGS'
 *
 * const isValidTag = (tag: string) => HTML_TAGS.includes(tag)
 * console.log(isValidTag('div')) // true
 * console.log(isValidTag('custom')) // false
 * ```
 *
 * @example Global usage
 * ```ts
 * import '@sky-modules/web/global'
 *
 * HTML_TAGS.forEach(tag => console.log(tag))
 * ```
 */
const HTML_TAGS = [
    // Document metadata
    'html',
    'base',
    'head',
    'link',
    'meta',
    'style',
    'title',

    // Sectioning root
    'body',

    // Content sectioning
    'address',
    'article',
    'aside',
    'footer',
    'header',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hgroup',
    'main',
    'nav',
    'section',
    'search',

    // Text content
    'blockquote',
    'dd',
    'div',
    'dl',
    'dt',
    'figcaption',
    'figure',
    'hr',
    'li',
    'menu',
    'ol',
    'p',
    'pre',
    'ul',

    // Inline text semantics
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'code',
    'data',
    'dfn',
    'em',
    'i',
    'kbd',
    'mark',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'var',
    'wbr',

    // Image and multimedia
    'area',
    'audio',
    'img',
    'map',
    'track',
    'video',

    // Embedded content
    'embed',
    'iframe',
    'object',
    'picture',
    'portal',
    'source',

    // SVG and MathML
    'svg',
    'math',

    // Scripting
    'canvas',
    'noscript',
    'script',

    // Demarcating edits
    'del',
    'ins',

    // Table content
    'caption',
    'col',
    'colgroup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',

    // Forms
    'button',
    'datalist',
    'fieldset',
    'form',
    'input',
    'label',
    'legend',
    'meter',
    'optgroup',
    'option',
    'output',
    'progress',
    'select',
    'textarea',

    // Interactive elements
    'details',
    'dialog',
    'summary',

    // Web Components
    'slot',
    'template',
] as const
export default HTML_TAGS
