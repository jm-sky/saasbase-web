declare module 'turndown' {
  export default class TurndownService {
    constructor(options?: TurndownService.Options)
    turndown(html: string): string
  }

  namespace TurndownService {
    interface Options {
      headingStyle?: 'setext' | 'atx'
      hr?: string
      bulletListMarker?: '-' | '+' | '*'
      codeBlockStyle?: 'indented' | 'fenced'
      emDelimiter?: '_' | '*'
      fence?: '```' | '~~~'
      strongDelimiter?: '__' | '**'
      linkStyle?: 'inlined' | 'referenced'
      linkReferenceStyle?: 'full' | 'collapsed' | 'shortcut'
    }
  }
}
