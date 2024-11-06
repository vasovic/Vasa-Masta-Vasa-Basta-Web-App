import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FirmaComponent } from './firma/firma.component';

const routes: Routes = [
  { path: '', component: PocetnaComponent },
  { path: 'vlasnik', component: VlasnikComponent },
  { path: 'dekorater', component: DekoraterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'promenaLozinke', component: PromenaLozinkeComponent},
  { path: 'firma', component: FirmaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
