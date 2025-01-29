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
    ToastrModule.forRoot()
  ],
  providers: [
    provideNgxMask(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
