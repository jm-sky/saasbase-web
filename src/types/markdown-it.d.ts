declare module 'markdown-it' {
  export default class MarkdownIt {
    constructor(options?: MarkdownIt.Options)
    render(src: string): string
  }

  namespace MarkdownIt {
    interface Options {
      html?: boolean
      breaks?: boolean
      linkify?: boolean
      typographer?: boolean
      quotes?: string
      highlight?: (str: string, lang: string) => string
    }
  }
}
