import { Component, Input } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { IUsuario } from '../../../helpers/models/IUsusario';
import { AuthService } from '../../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  @Input() subjectIsOpenMenu = new BehaviorSubject<boolean>(true);
  public usuario: IUsuario | undefined;

  constructor(
    private _service: GenericHttpService<any>,
    private _serviceAuth: AuthService,
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this._service.get('Usuarios/GetMyUser')
      .subscribe({
        next: (response) => {
          this.usuario = response;
          this._serviceAuth.setLocalStorageUserERP(this.usuario);
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  toggleMenu() {
    this.subjectIsOpenMenu.next(!this.subjectIsOpenMenu.value);
  }

  logout(){
    this._serviceAuth.logoutSSOUser();
    this.usuario = undefined;
  }
}
