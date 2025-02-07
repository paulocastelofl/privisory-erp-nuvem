import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { MainStructureComponent } from './shared/components/main-structure/main-structure.component';
import { UsuariosComponent } from './modules/usuarios/editar-criar-usuarios/usuarios.component';
import { ListarUsuariosComponent } from './modules/usuarios/listar-usuarios/listar-usuarios.component';
import { ListarProdutosComponent } from './modules/produtos/listar-produtos/listar-produtos.component';
import { EditarCriarProdutosComponent } from './modules/produtos/editar-criar-produtos/editar-criar-produtos.component';
import { ListarFormasPagamentoComponent } from './modules/formas-pagamento/listar-formas-pagamento/listar-formas-pagamento.component';
import { EditarCriarFormasPagamentoComponent } from './modules/formas-pagamento/editar-criar-formas-pagamento/editar-criar-formas-pagamento.component';
import { ListarRecebimentoNfeComponent } from './modules/recebimento-nfe/listar-recebimento-nfe/listar-recebimento-nfe.component';
import { EditarCriarRecebimentoNfeComponent } from './modules/recebimento-nfe/editar-criar-recebimento-nfe/editar-criar-recebimento-nfe.component';
import { AuthGuard } from './helpers/guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    canActivate: [AuthGuard],
    path: '',
    component: MainStructureComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: ListarUsuariosComponent },
      { path: 'usuarios/novo', component: UsuariosComponent },
      { path: 'usuarios/:hash', component: UsuariosComponent },
      { path: 'produtos', component: ListarProdutosComponent },
      { path: 'produtos/novo', component: EditarCriarProdutosComponent },
      { path: 'produtos/:hash', component: EditarCriarProdutosComponent },
      { path: 'formas-pagamento', component: ListarFormasPagamentoComponent },
      { path: 'formas-pagamento/novo', component: EditarCriarFormasPagamentoComponent },
      { path: 'formas-pagamento/:hash', component: EditarCriarFormasPagamentoComponent },
      { path: 'recebimento-nfe', component: ListarRecebimentoNfeComponent },
      { path: 'recebimento-nfe/novo', component: EditarCriarRecebimentoNfeComponent },
      { path: 'recebimento-nfe/:hash', component: EditarCriarRecebimentoNfeComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
