import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main';
import { DetailsComponent } from './pages/details/details';
import { AdminListComponent } from './pages/admin-list/admin-list';
import { PlaceFormComponent } from './pages/place-form/place-form';
export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'trip/:id', component: DetailsComponent },
  { path: 'admin', component: AdminListComponent },
  { path: 'admin/add', component: PlaceFormComponent },
  { path: 'admin/edit/:id', component: PlaceFormComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
