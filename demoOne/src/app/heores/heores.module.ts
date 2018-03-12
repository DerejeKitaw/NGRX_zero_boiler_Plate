import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeoresRoutingModule } from './heores-routing.module';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

@NgModule({
  imports: [
    CommonModule,
    HeoresRoutingModule
  ],
  declarations: [HeroesComponent, HeroListComponent, HeroDetailComponent]
})
export class HeoresModule { }
