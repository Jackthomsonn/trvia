import { HostGamePage } from './../host-game/host-game';
import { Component } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'

import { WelcomePage } from './../welcome/welcome'

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

  private playerName: string
  private gameToJoin: string

  constructor(
    private navCtrl: NavController,
    private headerServiceProvider: HeaderServiceProvider,
    private socketServiceProvider: SocketServiceProvider,
    private playerServiceProvider: PlayerServiceProvider) {
  }

  public joinGame = (gameId) => {
    this.gameToJoin = gameId

    this.socketServiceProvider.emit('joinGame', {
      gameId: gameId,
      playerName: this.playerName,
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
        playerName: this.playerName
      })
    })

    this.socketServiceProvider.on('updateLiveGames', (games) => {
      this.liveGames = games.list
    })
  }

  ionViewDidEnter() {
    this.socketServiceProvider.socket.off('joinedGame')

    this.setupSocketEventListeners()

    this.socketServiceProvider.emit('getLiveGames')

    this.playerServiceProvider.getPlayerInformation().then(player => {
      this.playerName = player.name

      this.headerServiceProvider.setup({
        text: 'Live games',
        subText: 'Join a live game',
        showAlternativeMessage: false
      })
    }).catch(() => {
      this.navCtrl.push(WelcomePage)
    })
  }
}
