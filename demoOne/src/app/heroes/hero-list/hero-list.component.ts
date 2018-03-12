import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { Hero } from '../heroes/hero';


@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroListComponent {
  @Input() heroes: Hero[];
  @Input() selectedHero: Hero;
  @Output() deleted = new EventEmitter<Hero>();
  @Output() selected = new EventEmitter<Hero>();

  byId(hero: Hero) {
    return hero.id;
  }

  onSelect(hero: Hero) {
    this.selected.emit(hero);
  }

  deleteHero(hero: Hero) {
    this.deleted.emit(hero);
  }
}
