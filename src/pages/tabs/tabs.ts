import { Component } from '@angular/core'

import { JoinGamePage } from '../join-game/join-game'
import { LiveGamesPage } from './../live-games/live-games'
import { CreateGamePage } from './../create-game/create-game'

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage { 
  public joinGameRoot = JoinGamePage
  public liveGamesRoot = LiveGamesPage
  public createGameRoot = CreateGamePage
}