import { Component } from '@angular/core'
import { IonicPage, NavController } from 'ionic-angular'
import { Platform } from 'ionic-angular/platform/platform'

import { Keyboard } from '@ionic-native/keyboard'

import { IPlayer } from './../../interfaces/IPlayer'

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
  private player: IPlayer

  constructor(
    private navCtrl: NavController,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
    private toastCtrl: ToastController,
    private platform: Platform,
    private keyboard: Keyboard) {
  }

  public joinGame = () => {
    this.socketServiceProvider.emit('joinGame', {
      gameId: this.gameId,
      name: this.player.name,
      isHost: false
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('joinedGame', () => {
      this.navCtrl.push(HostGamePage, {
        gameId: this.gameId,
        isHost: false,
        playerName: this.player.name
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
    this.platform.ready().then(() => {
      this.keyboard.hideKeyboardAccessoryBar(false)
    })
    this.setupSocketEventListeners()
  }

  ionViewDidEnter() {
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
  }
}