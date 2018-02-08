import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular'
import { Haptic } from 'ionic-angular/tap-click/haptic'

import { ToastController } from 'ionic-angular/components/toast/toast-controller'
import { Toast } from 'ionic-angular/components/toast/toast'

import { IPlayer } from './../../interfaces/IPlayer'

import { PlayGamePage } from './../play-game/play-game'

import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from './../../providers/header-service/header-service'

@IonicPage()
@Component({
  selector: 'page-host-game',
  templateUrl: 'host-game.html',
})

export class HostGamePage {
  public players: Array<IPlayer> = []

  private toastInstance: Toast
  private disconnectionToast: Toast

  @ViewChild(Navbar) navbar: Navbar

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private toastCtrl: ToastController,
    private haptic: Haptic) {
  }

  public startGame = () => {
    if (this.haptic.available()) {
      this.haptic.impact({ style: 'heavy' })
    }

    this.socketServiceProvider.emit('startGame', { gameId: this.getGameId() })
  }

  public isTheHost() {
    return this.navParams.data.isHost
  }

  private getPlayers() {
    this.socketServiceProvider.emit('getPlayers', { gameId: this.getGameId() })
  }

  private getGameId() {
    return this.navParams.data.gameId
  }

  private getPlayerName() {
    return this.navParams.data.playerName
  }

  private handleDisconnection = (socket) => {
    this.disconnectionToast = this.toastCtrl.create({
      message: 'Connection was lost, reconnecting..'
    })

    this.disconnectionToast.present()

    this.navCtrl.popToRoot()
  }

  private handleReconnection = (socket) => {
    this.disconnectionToast.dismiss().then(() => {
      this.toastCtrl.create({
        message: 'Reconnected successfully',
        duration: 2000
      }).present()
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('startTheGame', questions => {
      this.navCtrl.push(PlayGamePage, {
        questions: questions,
        isTheHost: this.isTheHost(),
        gameId: this.getGameId(),
        playerName: this.getPlayerName()
      }).then(() => {
        let index = 1
        this.navCtrl.remove(index)
      })
    })

    this.socketServiceProvider.on('updatePlayersInGame', players => {
      players.forEach(player => {
        this.players.push(player)
      })
    })

    this.socketServiceProvider.on('playerLeft', playerName => {
      this.players.pop()
    })

    this.socketServiceProvider.on('playerJoined', player => {
      this.players.push({ name: player })
    })

    this.socketServiceProvider.on('hostLeft', () => {
      if (!this.isTheHost()) {
        if (this.toastInstance) {
          return
        } else {
          this.toastInstance = this.toastCtrl.create({
            message: 'The host left the game',
            showCloseButton: true,
            duration: 5000
          })

          this.toastInstance.onDidDismiss(() => {
            this.toastInstance = undefined
          })

          this.toastInstance.present()

          this.navCtrl.popToRoot()
        }
      }
    })

    this.socketServiceProvider.on('disconnect', this.handleDisconnection)

    this.socketServiceProvider.on('reconnect', this.handleReconnection)
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = () => {
      this.navCtrl.pop()
      this.socketServiceProvider.emit('leaveGame', {
        gameId: this.getGameId(),
        playerName: this.getPlayerName()
      })
    }
  }

  ionViewDidEnter() {
    this.socketServiceProvider.off([
      'startTheGame',
      'hostLeft',
      'disconnect',
      'reconnect'
    ])

    this.setupSocketEventListeners()

    this.headerServiceProvider.setup({
      text: 'Share the ID below with the people you wish to join your game',
      subText: this.getGameId(),
      showAlternativeMessage: !this.isTheHost()
    })

    this.getPlayers()
  }
}
