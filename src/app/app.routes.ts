import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/home/home.component').then((component) => component.HomeComponent),
  },
  {
    path: 'enviar',
    loadComponent: () =>
      import('./pages/enviar-cartinha/enviar-cartinha.component').then(
        (component) => component.EnviarCartinhaComponent,
      ),
  },
  {
    path: 'obrigada',
    loadComponent: () =>
      import('./pages/obrigada/obrigada.component').then(
        (component) => component.ObrigadaComponent,
      ),
  },
  {
    path: 'cartinhas',
    loadComponent: () =>
      import('./pages/mural-cartinhas/mural-cartinhas.component').then(
        (component) => component.MuralCartinhasComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
