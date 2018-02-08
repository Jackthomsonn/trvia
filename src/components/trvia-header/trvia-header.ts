import { Component } from '@angular/core';

import { HeaderServiceProvider } from './../../providers/header-service/header-service'


@Component({
  selector: 'trvia-header',
  templateUrl: 'trvia-header.html'
})

export class TrviaHeaderComponent {
  public text: string
  public subText: string
  public showAlternativeMessage: boolean

  constructor(private headerServiceProvider: HeaderServiceProvider) {
    this.headerServiceProvider.text.subscribe(text => this.text = text)
    this.headerServiceProvider.subText.subscribe(subText => this.subText = subText)
    this.headerServiceProvider.showAlternativeMessage.subscribe(showAlternativeMessage => this.showAlternativeMessage = showAlternativeMessage)
  }
}
