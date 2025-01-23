

export class PrettyConsole {

    public closeByNewLine: boolean;
    public useIcons: boolean;
    public logsTitle: string;
    public warningsTitle: string;
    public errorsTitle: string;
    public informationsTitle: string;
    public successesTitle: string;
    public debugsTitle: string;
    public assertsTitle: string;

    constructor(){

        this.closeByNewLine = true;
        this.useIcons=true;
        this.logsTitle = "LOGS";
        this.warningsTitle= 'WARNINGS';
        this.errorsTitle = "ERRORS";
        this.informationsTitle="INFORMATIONS";
        this.successesTitle="SUCCESS";
        this.debugsTitle="DEBUG";
        this.assertsTitle = "ASSERT";
    }

    private getColorReset(): string {
        return '\x1b[0m'
      }

    private getColor(foregroundColor: string = '', backgroundColor: string = ''): string {
        let fgc = '\x1b[37m'
        switch (foregroundColor.trim().toLowerCase()) {
          case 'black':
            fgc = '\x1b[30m'
            break;
          case 'red':
            fgc = '\x1b[31m'
            break;
          case 'green':
            fgc = '\x1b[32m'
            break;
          case 'yellow':
            fgc = '\x1b[33m'
            break;
          case 'blue':
            fgc = '\x1b[34m'
            break;
          case 'magenta':
            fgc = '\x1b[35m'
            break;
          case 'cyan':
            fgc = '\x1b[36m'
            break;
          case 'white':
            fgc = '\x1b[37m'
            break;
        }
  
        let bgc = ''
        switch (backgroundColor.trim().toLowerCase()) {
          case 'black':
            bgc = '\x1b[40m'
            break;
          case 'red':
            bgc = '\x1b[44m'
            break;
          case 'green':
            bgc = '\x1b[44m'
            break;
          case 'yellow':
            bgc = '\x1b[43m'
            break;
          case 'blue':
            bgc = '\x1b[44m'
            break;
          case 'magenta':
            bgc = '\x1b[45m'
            break;
          case 'cyan':
            bgc = '\x1b[46m'
            break;
          case 'white':
            bgc = '\x1b[47m'
            break;
        }
  
        return `${fgc}${bgc}`
    }

    print(foregroundColor: string = 'white', backgroundColor: string = 'black', ...strings: any) {
        const c = this.getColor(foregroundColor, backgroundColor)
        // turns objects into printable strings
        strings = strings.map((item:any) => {
          if (typeof item === 'object') item = JSON.stringify(item)
          return item
        })
        console.log(c, strings.join(''), this.getColorReset())
        if (this.closeByNewLine) {
          console.log('')
        }
      }

      clear(): void {
        console.clear()
      }

      logging(...strings:any):void{

        const fg = 'white'
        const bg = ''
        const groupTile = ` ${this.logsTitle}`
        const icon = '';
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item, this.getColorReset())
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }

      }

      warn(...strings: any): void {
        const fg = 'yellow'
        const bg = ''
        const icon = '';
        const groupTile = ` ${this.warningsTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item, this.getColorReset())
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
      error(...strings: any): void {
        const fg = 'red'
        const bg = ''
        const icon = '\u26D4'
        const groupTile = ` ${this.errorsTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item)
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
      info(...strings: any): void {
        const fg = 'blue'
        const bg = ''
        const icon = '\u2139'
        const groupTile = ` ${this.informationsTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item)
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
      success(...strings: any): void {
        const fg = 'green'
        const bg = ''
        const icon = '\u2713'
        const groupTile = ` ${this.successesTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item)
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
      debug(...strings: any): void {
        const fg = 'magenta'
        const bg = ''
        const icon = '\u1367'
        const groupTile = ` ${this.debugsTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item)
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
      assert(...strings: any): void {
        const fg = 'cyan'
        const bg = ''
        const icon = '\u0021'
        const groupTile = ` ${this.assertsTitle}`
        if (strings.length > 1) {
          const c = this.getColor(fg, bg)
          console.group(c, (this.useIcons ? icon : '') + groupTile)
          const nl = this.closeByNewLine
          this.closeByNewLine = false
          strings.forEach((item:any) => {
            this.print(fg, bg, item)
          })
          this.closeByNewLine = nl
          console.groupEnd()
          if (nl) {
            console.log()
          }
        } else {
          this.print(fg, bg, strings.map((item:any) => {
            return `${(this.useIcons ? `${icon} ` : '')}${item}`
          }))
        }
      }
}