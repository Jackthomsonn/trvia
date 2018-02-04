import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'

import { IPlayer } from './../../interfaces/IPlayer'

import { HostGamePage } from './../host-game/host-game'

import { HeaderServiceProvider } from './../../providers/header-service/header-service'
import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { PlayerServiceProvider } from '../../providers/player-service/player-service'

@IonicPage()
@Component({
  selector: 'page-live-games',
  templateUrl: 'live-games.html',
})

export class LiveGamesPage {
  public liveGames: Array<any>

  private gameToJoin: string
  private player: IPlayer

  constructor(
    private navCtrl: NavController,
    private headerServiceProvider: HeaderServiceProvider,
    private socketServiceProvider: SocketServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private platform: Platform) {
  }

  public joinGame = (gameId) => {
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
    this.socketServiceProvider.socket.off('joinedGame')

    this.setupSocketEventListeners()

    this.socketServiceProvider.emit('getLiveGames')

    this.headerServiceProvider.setup({
      text: 'Live games',
      subText: 'Join a live game',
      showAlternativeMessage: false
    })
  }
}
