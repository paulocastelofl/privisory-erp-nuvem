import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { MainStructureComponent } from './shared/components/main-structure/main-structure.component';
import { UsuariosComponent } from './modules/usuarios/editar-criar-usuarios/usuarios.component';
import { ListarUsuariosComponent } from './modules/usuarios/listar-usuarios/listar-usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainStructureComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: ListarUsuariosComponent },
      { path: 'usuarios/novo', component: UsuariosComponent },
      { path: 'usuarios/:hash', component: UsuariosComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
