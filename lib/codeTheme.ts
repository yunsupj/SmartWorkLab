/**
 * SmartWorkLab code theme — high-contrast dark theme for article code blocks.
 *
 * Built on atomDark's structure with the editorial palette. Every token
 * color was measured against the #0F172A background and passes WCAG AA
 * (4.5:1) with margin — the weakest is operator #9FB3C8 at 8.29:1.
 * atomDark's comment color (#7C7C7C) failed AA at 3.96:1, which is why
 * this theme exists instead of importing atomDark directly.
 *
 * Measured ratios (foreground on #0F172A):
 *   default #E8EEF6 15.30:1 · comment #AAB9CC 8.94:1 · punctuation #C3CEDD 11.22:1
 *   keyword #89D9B0 10.72:1 · string #A8D8B9 11.21:1 · number #F2B880 10.15:1
 *   function #8FD3E8 10.75:1 · operator #9FB3C8 8.29:1 · tag #F2A0A0 8.77:1
 *   boolean #E8B4D8 10.16:1
 */
const codeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: '#E8EEF6',
    background: 'none',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: 4,
    OTabSize: 4,
    tabSize: 4,
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#E8EEF6',
    background: '#0F172A',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: 4,
    OTabSize: 4,
    tabSize: 4,
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  ':not(pre) > code[class*="language-"]': {
    background: '#0F172A',
    padding: '.1em',
    borderRadius: '.3em',
    whiteSpace: 'normal',
  },
  comment: { color: '#AAB9CC' },
  prolog: { color: '#AAB9CC' },
  doctype: { color: '#AAB9CC' },
  cdata: { color: '#AAB9CC' },
  punctuation: { color: '#C3CEDD' },
  '.namespace': { opacity: 0.85 },
  property: { color: '#8FD3E8' },
  keyword: { color: '#89D9B0' },
  tag: { color: '#F2A0A0' },
  'class-name': { color: '#F2D8A0' },
  boolean: { color: '#E8B4D8' },
  constant: { color: '#E8B4D8' },
  symbol: { color: '#E8B4D8' },
  deleted: { color: '#F2A0A0' },
  number: { color: '#F2B880' },
  selector: { color: '#89D9B0' },
  'attr-name': { color: '#8FD3E8' },
  string: { color: '#A8D8B9' },
  char: { color: '#A8D8B9' },
  builtin: { color: '#F2B880' },
  inserted: { color: '#89D9B0' },
  variable: { color: '#E8EEF6' },
  operator: { color: '#9FB3C8', background: 'none' },
  entity: { color: '#F2B880', cursor: 'help' },
  url: { color: '#8FD3E8' },
  '.language-css .token.string': { color: '#A8D8B9' },
  '.style .token.string': { color: '#A8D8B9' },
  atrule: { color: '#89D9B0' },
  'attr-value': { color: '#A8D8B9' },
  function: { color: '#8FD3E8' },
  regex: { color: '#F2B880' },
  important: { color: '#F2B880', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};

export default codeTheme;
