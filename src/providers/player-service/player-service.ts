import { Injectable } from '@angular/core'

import { NativeStorage } from '@ionic-native/native-storage'

import { IPlayer } from '../../interfaces/IPlayer'

@Injectable()
export class PlayerServiceProvider {

  constructor(private nativeStorage: NativeStorage) { }

  public getPlayerInformation(): Promise<IPlayer> {
    return this.nativeStorage.getItem('playerInformation')
  }

  public setPlayerInformation(playerInformation: IPlayer) {
    this.nativeStorage.setItem('playerInformation', playerInformation)
  }

  public removePlayerInformation() {
    this.nativeStorage.remove('playerInformation')
  }
}
