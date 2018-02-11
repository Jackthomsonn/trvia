import { NgModule } from '@angular/core'

import { IonicPageModule } from 'ionic-angular'

import { ComponentsModule } from '../../components/components.module'

import { HostGamePage } from './host-game'

@NgModule({
  declarations: [
    HostGamePage
  ],
  imports: [
    IonicPageModule.forChild(HostGamePage),
    ComponentsModule
  ],
})

export class HostGamePageModule {}
