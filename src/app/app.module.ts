import { LiveGamesPage } from './../pages/live-games/live-games';
import { WelcomePage } from './../pages/welcome/welcome';
import { PlayGamePage } from './../pages/play-game/play-game'
import { HostGamePage } from './../pages/host-game/host-game'
import { SocketServiceProvider } from './../providers/socket-service/socket-service'
import { JoinGamePage } from './../pages/join-game/join-game'
import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { Trvia } from './app.component'

import { TabsPage } from '../pages/tabs/tabs'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { HttpClientModule } from '@angular/common/http'
import { CreateGamePage } from '../pages/create-game/create-game'
import { HeaderServiceProvider } from '../providers/header-service/header-service'
import { ComponentsModule } from '../components/components.module'
import { NativeStorage } from '@ionic-native/native-storage'
import { PlayerServiceProvider } from '../providers/player-service/player-service'

@NgModule({
  declarations: [
    Trvia,
    TabsPage,
    JoinGamePage,
    CreateGamePage,
    PlayGamePage,
    HostGamePage,
    WelcomePage,
    LiveGamesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Trvia, {
      tabsHideOnSubPages: true,
      swipeBackEnabled: true
    }),
    HttpClientModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Trvia,
    TabsPage,
    JoinGamePage,
    CreateGamePage,
    PlayGamePage,
    HostGamePage,
    WelcomePage,
    LiveGamesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SocketServiceProvider,
    HeaderServiceProvider,
    NativeStorage,
    PlayerServiceProvider
  ]
})

export class AppModule { }
