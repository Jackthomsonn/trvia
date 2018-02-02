import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'

import { JoinGamePage } from './../join-game/join-game'

import { HeaderServiceProvider } from './../../providers/header-service/header-service'
import { PlayerServiceProvider } from './../../providers/player-service/player-service'

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage {
  public playerName: string

  constructor(
    private navCtrl: NavController,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider) {
  }

  public getStarted() {
    this.playerServiceProvider.setPlayerInformation({
      name: this.playerName,
      level: 1,
      points: 0
    })
    this.navCtrl.setRoot(JoinGamePage)
  }

  ionViewDidLoad() {
    this.headerServiceProvider.setup({
      text: 'Welcome',
      subText: 'Lets get you setup',
      showAlternativeMessage: undefined
    })
  }
}
