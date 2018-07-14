import { NgModule } from '@angular/core'

import { IonicPageModule } from 'ionic-angular'

import { WelcomePage } from './welcome'

import { ComponentsModule } from '../../components/components.module'

@NgModule({
  declarations: [],
  imports: [
    IonicPageModule.forChild(WelcomePage),
    ComponentsModule
  ],
})

export class WelcomePageModule { }
