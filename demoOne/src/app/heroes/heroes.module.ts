import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroesComponent } from './heroes/heroes.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesRoutingModule } from './heroes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HeroesService } from './heroes.service';
import { AppSelectors } from '../store/app-config';

@NgModule({
  imports: [
    CommonModule,
    HeroesRoutingModule,
    SharedModule
  ],
  declarations: [HeroesComponent, HeroListComponent, HeroDetailComponent],
  providers: [ AppSelectors, HeroesService ]
})
export class HeroesModule { }
