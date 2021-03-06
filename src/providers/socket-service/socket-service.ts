import { Injectable } from '@angular/core'

import * as io from 'socket.io-client'

import { ISocketEmittableData } from './../../interfaces/ISocketEmittableData'

@Injectable()
export class SocketServiceProvider {
  public socketUri: string
  public socket: io

  constructor() {
    this.socketUri = 'https://trvia.herokuapp.com'
    this.connectClientSocket()
  }

  public emit(event: string, data?: ISocketEmittableData) {
    this.socket.emit(event, data)
  }

  public on(event: string, callback: Function) {
    this.socket.on(event, callback)
  }

  public off(events: Array<string>) {
    if (!events) {
      return
    }

    events.forEach(event => this.socket.off(event))
  }

  private connectClientSocket() {
    this.socket = io.connect(this.socketUri, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    })
  }
}