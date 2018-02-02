import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { ComponentsModule } from '../../components/components.module'

import { LiveGamesPage } from './live-games'

@NgModule({
  declarations: [
    LiveGamesPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveGamesPage),
    ComponentsModule
  ],
})

export class LiveGamesPageModule { }
