import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/login/login.component';
import { MainStructureComponent } from './shared/components/main-structure/main-structure.component';
import { NavbarVerticalComponent } from './shared/components/navbar-vertical/navbar-vertical.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './helpers/interceptors/auth.interceptor';
import { UsuariosComponent } from './modules/usuarios/editar-criar-usuarios/usuarios.component';
import { ListarUsuariosComponent } from './modules/usuarios/listar-usuarios/listar-usuarios.component';
import { DataTablesSettingsDirective } from './shared/directives/data-tables-settings.directive';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ListarProdutosComponent } from './modules/produtos/listar-produtos/listar-produtos.component';
import { EditarCriarProdutosComponent } from './modules/produtos/editar-criar-produtos/editar-criar-produtos.component';
import { EditarCriarFormasPagamentoComponent } from './modules/formas-pagamento/editar-criar-formas-pagamento/editar-criar-formas-pagamento.component';
import { ListarFormasPagamentoComponent } from './modules/formas-pagamento/listar-formas-pagamento/listar-formas-pagamento.component';
import { ListarRecebimentoNfeComponent } from './modules/recebimento-nfe/listar-recebimento-nfe/listar-recebimento-nfe.component';
import { EditarCriarRecebimentoNfeComponent } from './modules/recebimento-nfe/editar-criar-recebimento-nfe/editar-criar-recebimento-nfe.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    MainStructureComponent,
    NavbarVerticalComponent,
    HeaderComponent,
    UsuariosComponent,
    ListarUsuariosComponent,
    DataTablesSettingsDirective,
    ListarProdutosComponent,
    EditarCriarProdutosComponent,
    EditarCriarFormasPagamentoComponent,
    ListarFormasPagamentoComponent,
    ListarRecebimentoNfeComponent,
    EditarCriarRecebimentoNfeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ToastrModule.forRoot(),
    CurrencyMaskModule
  ],
  providers: [
    provideNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
