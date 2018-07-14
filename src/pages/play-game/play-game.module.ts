import { NgModule } from '@angular/core'

import { IonicPageModule } from 'ionic-angular'

import { ComponentsModule } from '../../components/components.module'

import { PlayGamePage } from './play-game'

@NgModule({
  declarations: [],
  imports: [
    IonicPageModule.forChild(PlayGamePage),
    ComponentsModule
  ],
})

export class PlayGamePageModule { }
