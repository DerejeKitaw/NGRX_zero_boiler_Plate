# DemoOne

### generate new project
```
ng new demoOne --routing -sg -st --style=scss -d
```
### generate heroes module
```
ng g module heroes --routing -d
```
### generate heroes service
open  the terminal in heroes folder and run
```
ng g service heroes -d
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