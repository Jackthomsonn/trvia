import { Component } from '@angular/core'

import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'
import { Haptic } from 'ionic-angular/tap-click/haptic'

import { Keyboard } from '@ionic-native/keyboard'

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
    private playerServiceProvider: PlayerServiceProvider,
    private platform: Platform,
    private keyboard: Keyboard,
    private haptic: Haptic) {
  }

  public getStarted() {
    if (this.haptic.available()) {
      this.haptic.impact({ style: 'light' })
    }

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

    this.platform.ready().then(() => {
      this.keyboard.hideKeyboardAccessoryBar(false)
    })
  }
}
