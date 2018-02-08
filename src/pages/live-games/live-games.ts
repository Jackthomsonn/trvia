import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'
import { Haptic } from 'ionic-angular/tap-click/haptic'

import { IPlayer } from './../../interfaces/IPlayer'

import { HostGamePage } from './../host-game/host-game'

import { HeaderServiceProvider } from './../../providers/header-service/header-service'
import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { PlayerServiceProvider } from '../../providers/player-service/player-service'

import { LoadingController } from 'ionic-angular/components/loading/loading-controller'
import { Loading } from 'ionic-angular/components/loading/loading'

@IonicPage()
@Component({
  selector: 'page-live-games',
  templateUrl: 'live-games.html',
})

export class LiveGamesPage {
  public liveGames: Array<any>

  private gameToJoin: string
  private player: IPlayer
  private loadingInstance: Loading

  constructor(
    private navCtrl: NavController,
    private headerServiceProvider: HeaderServiceProvider,
    private socketServiceProvider: SocketServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private haptic: Haptic) {
  }

  public joinGame = (gameId) => {
    if (this.haptic.available()) {
      this.haptic.impact({ style: 'heavy' })
    }

    this.loadingInstance.present()

    this.gameToJoin = gameId

    this.socketServiceProvider.emit('joinGame', {
      gameId: gameId,
      playerName: this.player.name,
      isHost: false
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('listOfLiveGames', games => {
      this.liveGames = games.list
    })

    this.socketServiceProvider.on('joinedGame', () => {
      this.loadingInstance.dismiss()

      this.navCtrl.push(HostGamePage, {
        gameId: this.gameToJoin,
        isHost: false,
        playerName: this.player.name
      })
    })

    this.socketServiceProvider.on('updateLiveGames', (games) => {
      this.liveGames = games.list
    })
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.playerServiceProvider.getPlayerInformation().then((player: IPlayer) => {
        this.player = player
      })
    })
  }

  ionViewDidEnter() {
    this.socketServiceProvider.off(['joinedGame'])

    this.setupSocketEventListeners()

    this.socketServiceProvider.emit('getLiveGames')

    this.headerServiceProvider.setup({
      text: 'Live games',
      subText: 'Join a live game',
      showAlternativeMessage: false
    })

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Joining game...',
      spinner: 'crescent'
    })
  }
}
