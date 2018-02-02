import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'
import { Alert } from 'ionic-angular/components/alert/alert'

import { ToastController } from 'ionic-angular/components/toast/toast-controller'
import { Toast } from 'ionic-angular/components/toast/toast'

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
  private playerName: string

  constructor(
    private navCtrl: NavController,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private toastCtrl: ToastController,
    private platform: Platform) {
  }

  public joinGame = () => {
    this.socketServiceProvider.emit('joinGame', {
      gameId: this.gameId,
      playerName: this.playerName,
      isHost: false
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('joinedGame', () => {
      this.navCtrl.push(HostGamePage, {
        gameId: this.gameId,
        isHost: false,
        playerName: this.playerName
      })
    })

    this.socketServiceProvider.on('gameDoesNotExist', () => {
      if (this.toastInstance) {
        return
      }

      this.toastInstance = this.toastCtrl.create({
        message: 'That game does not exist',
        showCloseButton: true,
        duration: 5000
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
        duration: 5000
      })

      this.toastInstance.onDidDismiss(() => {
        this.toastInstance = undefined
      })

      this.toastInstance.present()
    })
  }

  ionViewDidLoad() {
    this.setupSocketEventListeners()
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.playerName = this.playerServiceProvider.playerInformation.name

      this.headerServiceProvider.setup({
        text: this.playerServiceProvider.playerInformation.name,
        subText: 'Level ' + this.playerServiceProvider.playerInformation.level,
        showAlternativeMessage: false
      })
    }).catch(() => {
      this.navCtrl.push(WelcomePage)
    })
  }
}