import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'

import { HostGamePage } from './../host-game/host-game'

import { SocketServiceProvider } from '../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from '../../providers/header-service/header-service'
import { PlayerServiceProvider } from './../../providers/player-service/player-service'

@IonicPage()
@Component({
  selector: 'page-create-game',
  templateUrl: 'create-game.html',
})

export class CreateGamePage {
  public gameName: string
  public isPrivateGame: boolean

  constructor(
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private navCtrl: NavController) {
  }

  public createGame() {
    this.playerServiceProvider.getPlayerInformation().then(player => {
      this.socketServiceProvider.emit('createGame', {
        gameName: this.gameName,
        isHost: true,
        playerName: player.name,
        private: this.isPrivateGame
      })
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('gameId', (gameId: string) => {
      this.playerServiceProvider.getPlayerInformation().then(player => {
        this.navCtrl.push(HostGamePage, {
          gameId: gameId,
          isHost: true,
          playerName: player.name
        })
      })
    })
  }

  ionViewDidLoad() {
    this.setupSocketEventListeners()
  }

  ionViewDidEnter() {
    this.headerServiceProvider.setup({
      text: 'Create your own game',
      subText: undefined,
      showAlternativeMessage: false
    })
  }
}
