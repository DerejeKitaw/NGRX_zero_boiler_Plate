import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Hero } from '../hero';
import { Observable } from 'rxjs/Observable';
import { HeroService } from '../hero.service';
import { MasterDetailCommands } from '../../core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesComponent implements MasterDetailCommands<Hero>, OnInit {
  selected: Hero;
  commands = this;

  heroes$: Observable<Hero[]>;
  loading$: Observable<boolean>;
  constructor(private heroService: HeroService) {
    this.heroes$ = heroService.entities$;
    this.loading$ = heroService.loading$;
  }
  add: (entity: Hero) => void;
  delete: (entity: Hero) => void;
  select: (entity: Hero) => void;
  update: (entity: Hero) => void;

  ngOnInit() {
  this.getHeroes();
  }
  close() {
    this.selected = null;
  }
  getHeroes() {
    this.heroService.getAll();
    this.close();
  }
}
