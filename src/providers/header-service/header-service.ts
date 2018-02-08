import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { IHeader } from '../../interfaces/IHeader'

@Injectable()
export class HeaderServiceProvider {
  public text: Subject<string> = new Subject()
  public subText: Subject<string> = new Subject()
  public showAlternativeMessage: Subject<boolean> = new Subject()

  public setup = (options: IHeader) => {
    this.text.next(options.text)
    this.subText.next(options.subText)
    this.showAlternativeMessage.next(options.showAlternativeMessage)
  }
}
