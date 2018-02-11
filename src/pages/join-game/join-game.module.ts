import { NgModule } from '@angular/core'

import { IonicPageModule } from 'ionic-angular'

import { ComponentsModule } from '../../components/components.module'

import { JoinGamePage } from './join-game'

@NgModule({
  declarations: [
    JoinGamePage
  ],
  imports: [
    IonicPageModule.forChild(JoinGamePage),
    ComponentsModule
  ],
})

export class JoinGamePageModule {}
