import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { ComponentsModule } from '../../components/components.module'

import { CreateGamePage } from './create-game'

@NgModule({
  declarations: [
    CreateGamePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateGamePage),
    ComponentsModule
  ],
})

export class CreateGamePageModule { }
