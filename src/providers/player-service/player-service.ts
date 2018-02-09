import { Injectable } from '@angular/core'

import { Storage } from '@ionic/storage'

import { IPlayer } from '../../interfaces/IPlayer'

@Injectable()
export class PlayerServiceProvider {

  constructor(private storage: Storage) { }

  public getPlayerInformation(): Promise<IPlayer> {
    return this.storage.get('playerInformation')
  }

  public setPlayerInformation(playerInformation: IPlayer) {
    this.storage.set('playerInformation', playerInformation)
  }

  public removePlayerInformation() {
    this.storage.remove('playerInformation')
  }
}
