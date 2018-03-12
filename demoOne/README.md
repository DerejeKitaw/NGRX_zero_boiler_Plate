# DemoOne

### generate new project
```
ng new demoOne --routing -sg -st --style=scss -d // remove -d to generate  // remove -st to have test file - skip test = st
```
### generate heroes module
```
ng g module heroes --routing -d
```
### generate heroes service
open  the terminal in heroes folder and run
```
ng g service heroes/heroes -d

# provide HeroesService in hero module
providers: [ HeroesService ]
```
### generate heroes, hero-list and hero-detail component
```
ng g c heroes -d
ng g c hero-list -d
ng g c hero-detail -d
```
### Define routing in `app-routing.module.ts`
```
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  {
    path: 'heroes',
    loadChildren: 'app/heroes/heroes.module#HeroesModule'
  },
  { path: '**', redirectTo: 'heroes' } // bad routes redirect to heroes
];
```
### Define routing in `heroes-routing.module.ts`
```
const routes: Routes = [
  { path: '', pathMatch: 'full', component: HeroesComponent }
];
```
### Install NgRx, related libraries, and ngrx-data
```
npm i @ngrx/effects @ngrx/entity @ngrx/store @ngrx/store-devtools ngrx-data ngrx-store-freeze angular-in-memory-web-api --save
```
### Install material
```
npm i @angular/cdk @angular/material hammerjs

import BrowserAnimationsModule in app.module.ts

import 'hammerjs' in main.ts
```
### Create app-config files
Create store/app-config folder and create the following

_store/app-config/actions.ts_
```
import { Action } from '@ngrx/store';

export const TOGGLE_DATASOURCE = 'TOGGLE_DATASOURCE [SESSION] ';

export class ToggleDataSource implements Action {
  readonly type = TOGGLE_DATASOURCE;
  constructor(public readonly payload: string) {}
}

export type All = ToggleDataSource;
```
_store/app-config/dispatchers.ts_
```
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { App } from '../../core';
import * as AppActions from './actions';
import { AppState } from './reducer';

@Injectable()
export class AppDispatchers {
  constructor(private store: Store<AppState>) {}

  toggleDataSource(location: string) {
    this.store.dispatch(new AppActions.ToggleDataSource(location));
  }
}
```
_store/app-config/reducer.ts_
```
import { ActionReducerMap } from '@ngrx/store';

import { App } from '../../core';
import * as AppActions from './actions';

export interface SessionState {
  dataSource: string;
}

export const initialState: SessionState = {
  dataSource: 'local'
};

export interface AppState {
  session: SessionState;
}

export const appConfigReducers: ActionReducerMap<AppState> = {
  session: sessionReducer
  // here is where i put other reducers, when i have them
};

export function sessionReducer(state = initialState, action: AppActions.All): SessionState {
  switch (action.type) {
    case AppActions.TOGGLE_DATASOURCE: {
      return {
        ...state,
        dataSource: action.payload
      };
    }
  }
  return state;
}
```
_store/app-config/selectors.ts_
```
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';

import { App } from '../../core';
import { AppState } from './reducer';
import { distinctUntilChanged, tap } from 'rxjs/operators';

import { initialState } from './reducer';

const getAppState = createFeatureSelector<AppState>('appConfig');
const getDataSource = createSelector(getAppState, (state: AppState) =>
  // state.session.dataSource); // fails when replay with redux dev tools
  // recover if no state as during replay in redux dev tools
  state ? state.session.dataSource : initialState.dataSource );

@Injectable()
export class AppSelectors {
  constructor(private store: Store<AppState>) {}

  dataSource$() {
    return this.store.select(getDataSource).pipe(distinctUntilChanged());
  }
}
```
_store/app-config/index.ts_
```
export * from './dispatchers';
export * from './selectors';
export * from './reducer';

import { AppDispatchers } from './dispatchers';
import { AppSelectors } from './selectors';

export const appConfigServices = [AppDispatchers, AppSelectors];

```
### Describe the entity model in `entity-metadata.ts` so the NGRX-Data knows what to do.

_entity-metadata.ts_
```
import { defaultSelectId, EntityMetadataMap, PropsFilterFnFactory } from 'ngrx-data';

export const entityMetadata: EntityMetadataMap = {
  Hero: {}
};
export const pluralNames = {
  // Case matters. Match the case of the entity name.
  Hero: 'Heroes'
};
```
### Create core module
```
ng g m core/core --flat -m app -d 
```
_core.module.ts_
```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [ToastService]
})
export class CoreModule { }

```

### Create toast servece and provide it to CoreModule
_../core/toast.service.ts_
```
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ToastService {
  constructor(public snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
```
### Create ngrx data toast servece
_ngrx-data-toast.service.ts_
```
import { Injectable, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { EntityAction, EntityActions, OP_ERROR, OP_SUCCESS } from 'ngrx-data';

import { ToastService } from '../core/toast.service';

/** Report ngrx-data success/error actions as toast messages **/
@Injectable()
export class NgrxDataToastService implements OnDestroy {
  private onDestroy = new Subject();

  constructor(actions$: EntityActions, toast: ToastService) {
    actions$.pipe(
      filter(ea => ea.op.includes(OP_SUCCESS) || ea.op.includes(OP_ERROR)),
      takeUntil(this.onDestroy)
    )
    .subscribe(action =>
      toast.openSnackBar(`${action.entityName} action`, action.op)
    );
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
```
### Generate AppStoreModule and EntityStoreModule and register it to AppModule
AppStoreModule: To import NgRx store, effects, and dev tools (for development only)
```
ng g m store/app-store --flat -m app -d  
``` 
_app-store.module.ts_
```
import { NgModule } from '@angular/core';

import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import { appConfigReducers, appConfigServices } from './app-config';
import { EntityStoreModule } from './entity-store.module';
import { NgrxDataToastService } from './ngrx-data-toast.service';

import { environment } from '../../environments/environment';

export const metaReducers: MetaReducer<any>[] = environment.production ? [] : []; // [storeFreeze];
@NgModule({
  imports: [
    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreModule.forFeature('appConfig', appConfigReducers),
    EntityStoreModule,
    environment.production ? [] : StoreDevtoolsModule.instrument()
  ],
  declarations: []
})
export class AppStoreModule { }
```         
EntityStoreModule: To register the Web API configuration, metadata, and plurals with the `ngrx-data` module in the root `AppModule`. EntityStoreModule is for feature.
```
ng g m store/entity-store --flat -m app -d  // remove Remove common module and update entity-store.module.ts to:      
```
_entity-store.module.ts_
```
import { NgModule } from '@angular/core';

import { DefaultDataServiceConfig, NgrxDataModule } from 'ngrx-data';

import { pluralNames, entityMetadata } from './entity-metadata';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: 'api',    // root path to web api
  timeout: 3000, // request timeout

  // Simulate latency for demo
  getDelay: 500,
  saveDelay: 800,
};

@NgModule({
  imports: [
    NgrxDataModule.forRoot({
      entityMetadata: entityMetadata,
      pluralNames: pluralNames
    })
  ],
  providers: [
    { provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }
  ]
})
export class EntityStoreModule {}

```
### Import HttpClientModule to `app.module.ts` 
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppStoreModule } from './store/app-store.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AppStoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Create Shared module
```
ng g m shared/shared --flat -m app -d 
```
_shared.module.ts_
```
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FilterComponent } from './filter/filter.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FilterComponent,
    ReactiveFormsModule
  ],
  declarations: [FilterComponent]
})
export class SharedModule {}

```
### generate fileter component in a shared folder
```
ng g c shared/filter -d
```
_filter.component.ts_
```
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

/** FilterComponent binds to a FilterObserver from parent component */
export interface FilterObserver {
  filter$: Observable<string>;
  setFilter(filterValue: string): void;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filterObserver: FilterObserver;
  @Input() filterPlaceholder: string;
  filter: FormControl = new FormControl();

  clear() {
    this.filter.setValue('');
  }

  ngOnInit() {
    // Set the filter to the current value from filterObserver or ''
    // IMPORTANT: filterObserver must emit at least once!
    this.filterObserver.filter$
    .pipe(take(1))
    // take(1) completes so no need to unsubscribe
    .subscribe(value => this.filter.setValue(value));

    this.filter.valueChanges
      .pipe(
        debounceTime(300), distinctUntilChanged())
      // no need to unsubscribe because subscribing to self
      .subscribe(pattern => this.filterObserver.setFilter(pattern));
  }
}

```
_filter.component.html_
```
<div>
  <form>
    <input matInput [formControl]="filter"[placeholder]="filterPlaceholder">
  </form>
  <button *ngIf="filter.value" (click)="clear()">close</button>
</div>

```

### update Hero component

# Generate app-dev.module.ts
```
app-dev.module.ts
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../in-memory-data.service';

@NgModule({
  imports: [
    AppModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 0,
      passThruUnknownUrl: true
    })
  ],
  providers: [{ provide: InMemoryDataService, useExisting: InMemoryDbService }],
  bootstrap: [AppComponent]
})
export class AppDevModule {}

```

### Generate toolbar component
```
ng g c core/toolbar -d
```

### Generate toggle-data-source.component.ts component
```
ng g c core/toggle-data-source -d
```
### Generate IdGeneratorService
```
ng g s core/id-generator -d
```