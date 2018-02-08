import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'

import { Keyboard } from '@ionic-native/keyboard'

import { IPlayer } from './../../interfaces/IPlayer'

import { HostGamePage } from './../host-game/host-game'

import { SocketServiceProvider } from '../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from '../../providers/header-service/header-service'
import { PlayerServiceProvider } from './../../providers/player-service/player-service'

import { LoadingController } from 'ionic-angular/components/loading/loading-controller'
import { Loading } from 'ionic-angular/components/loading/loading'

@IonicPage()
@Component({
  selector: 'page-create-game',
  templateUrl: 'create-game.html',
})

export class CreateGamePage {
  public gameName: string
  public isPrivateGame: boolean

  private player: IPlayer
  private loadingInstance: Loading

  constructor(
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    private loadingCtrl: LoadingController) {
  }

  public createGame() {
    this.loadingInstance.present()

    this.socketServiceProvider.emit('createGame', {
      gameName: this.gameName,
      isHost: true,
      playerName: this.player.name,
      private: this.isPrivateGame
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('gameId', (gameId: string) => {
      this.loadingInstance.dismiss()

      this.navCtrl.push(HostGamePage, {
        gameId: gameId,
        isHost: true,
        playerName: this.player.name
      })
    })
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.playerServiceProvider.getPlayerInformation().then(player => {
        this.player = player
      })

      this.keyboard.hideKeyboardAccessoryBar(false)
    })
  }

  ionViewDidEnter() {
    this.socketServiceProvider.off(['gameId'])

    this.setupSocketEventListeners()

    this.headerServiceProvider.setup({
      text: 'Create your own game',
      subText: undefined,
      showAlternativeMessage: false
    })

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Creating game...',
      spinner: 'crescent'
    })
  }
}
