import { Component, ViewChild } from '@angular/core'
import { Platform } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { NavController } from 'ionic-angular/navigation/nav-controller'

import { TabsPage } from '../pages/tabs/tabs'
import { WelcomePage } from './../pages/welcome/welcome'

@Component({
  templateUrl: 'app.html'
})

export class Trvia {
  public rootPage: any = TabsPage

  @ViewChild('trviaNav') nav: NavController

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
    })
  }
}
