import { BrowserModule } from '@angular/platform-browser'

import { NgModule } from '@angular/core'

import { TrviaHeaderComponent } from './trvia-header/trvia-header'

@NgModule({
	declarations: [TrviaHeaderComponent],
	imports: [BrowserModule],
	exports: [TrviaHeaderComponent]
})

export class ComponentsModule { }
