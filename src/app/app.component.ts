import { Component, ViewChild } from '@angular/core'
import { Platform } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { NavController } from 'ionic-angular/navigation/nav-controller'

import { TabsPage } from '../pages/tabs/tabs'
import { WelcomePage } from './../pages/welcome/welcome'

import { PlayerServiceProvider } from './../providers/player-service/player-service'

@Component({
  templateUrl: 'app.html'
})

export class Trvia {
  public rootPage: any = TabsPage

  @ViewChild('trviaNav') nav: NavController

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private playerServiceProvider: PlayerServiceProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault()
      splashScreen.hide()
      this.playerServiceProvider.getPlayerInformation().then(player => {
        this.playerServiceProvider.playerInformation = player
      }).catch(() => {
        this.nav.push(WelcomePage)
      })
    })
  }
}
