import { Component } from '@angular/core'

import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'
import { Haptic } from 'ionic-angular/tap-click/haptic'
import { ToastController } from 'ionic-angular/components/toast/toast-controller'
import { Toast } from 'ionic-angular/components/toast/toast'
import { LoadingController } from 'ionic-angular/components/loading/loading-controller'
import { Loading } from 'ionic-angular/components/loading/loading'

import { Keyboard } from '@ionic-native/keyboard'

import { IPlayer } from './../../interfaces/IPlayer'

import { HostGamePage } from './../host-game/host-game'
import { WelcomePage } from '../welcome/welcome'

import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from './../../providers/header-service/header-service'
import { PlayerServiceProvider } from './../../providers/player-service/player-service'

@IonicPage()
@Component({
  selector: 'page-join-game',
  templateUrl: 'join-game.html',
})

export class JoinGamePage {
  public gameId: string

  private toastInstance: Toast
  private player: IPlayer
  private loadingInstance: Loading

  constructor(
    private navCtrl: NavController,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private toastCtrl: ToastController,
    private platform: Platform,
    private keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private haptic: Haptic) {
  }

  public joinGame = () => {
    if (this.haptic.available()) {
      this.haptic.impact({ style: 'heavy' })
    }

    this.loadingInstance.present()

    this.socketServiceProvider.emit('joinGame', {
      gameId: this.gameId,
      playerName: this.player.name,
      isHost: false
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('joinedGame', () => {
      this.loadingInstance.dismiss()

      this.navCtrl.push(HostGamePage, {
        gameId: this.gameId,
        isHost: false,
        playerName: this.player.name
      })
    })

    this.socketServiceProvider.on('gameDoesNotExist', () => {
      this.loadingInstance.dismiss()

      this.loadingInstance = this.loadingCtrl.create({
        content: 'Joining game...',
        spinner: 'crescent'
      })

      if (this.toastInstance) {
        return
      }

      this.toastInstance = this.toastCtrl.create({
        message: 'That game does not exist',
        showCloseButton: true,
        duration: 3000
      })

      this.toastInstance.onDidDismiss(() => {
        this.toastInstance = undefined
      })

      this.toastInstance.present()
    })

    this.socketServiceProvider.on('gameHasStarted', () => {
      if (this.toastInstance) {
        return
      }

      this.toastInstance = this.toastCtrl.create({
        message: 'That game has already started',
        showCloseButton: true,
        duration: 3000
      })

      this.toastInstance.onDidDismiss(() => {
        this.toastInstance = undefined
      })

      this.toastInstance.present()
    })
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.keyboard.hideKeyboardAccessoryBar(false)
    })
  }

  ionViewDidEnter() {
    this.socketServiceProvider.off([
      'joinedGame',
      'gameDoesNotExist',
      'gameHasStarted'
    ])

    this.setupSocketEventListeners()

    this.platform.ready().then(() => {
      this.playerServiceProvider.getPlayerInformation().then((player: IPlayer) => {
        this.player = player

        this.headerServiceProvider.setup({
          text: this.player.name,
          subText: 'Points ' + this.player.points,
          showAlternativeMessage: false
        })
      }).catch(() => {
        this.navCtrl.push(WelcomePage)
      })
    })

    this.loadingInstance = this.loadingCtrl.create({
      content: 'Joining game...',
      spinner: 'crescent'
    })
  }
}