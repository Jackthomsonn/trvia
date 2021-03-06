import { Component } from '@angular/core'

import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'
import { Haptic } from 'ionic-angular/tap-click/haptic'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller'
import { Loading } from 'ionic-angular/components/loading/loading'

import { Keyboard } from '@ionic-native/keyboard'

import { IPlayer } from './../../interfaces/IPlayer'
import { IGame } from './../../interfaces/IGame'

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
  public game: IGame

  private player: IPlayer
  private loadingInstance: Loading

  constructor(
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private navCtrl: NavController,
    private platform: Platform,
    private keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private haptic: Haptic) {
    this.setupProps()
  }

  public createGame() {
    if (this.haptic.available()) {
      this.haptic.impact({ style: 'light' })
    }

    this.loadingInstance.present()

    this.socketServiceProvider.emit('createGame', {
      gameName: this.game.name,
      isHost: true,
      playerName: this.player.name,
      private: this.game.private,
      difficulty: this.game.difficulty,
      amount: this.game.amountOfQuestions
    })
  }

  public formIsComplete() {
    return !this.game.name || !this.game.amountOfQuestions || !this.game.difficulty
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

  private setupProps() {
    this.game = {
      name: undefined,
      amountOfQuestions: 10,
      difficulty: 'easy',
      private: false
    }
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

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Creating game...',
      spinner: 'crescent'
    })

    this.headerServiceProvider.setup({
      text: 'Create your own game',
      subText: undefined,
      showAlternativeMessage: false
    })
  }
}
