import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { MenuSupport } from '../../../helpers/models/IMenuSupport';

@Component({
  selector: 'app-navbar-vertical',
  standalone: false,
  
  templateUrl: './navbar-vertical.component.html',
  styleUrl: './navbar-vertical.component.scss'
})
export class NavbarVerticalComponent {

  public menus: any[] = [];

  constructor(
    private _service: GenericHttpService<any>,
  ) { }

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    this._service.get('Menu')
      .subscribe({
        next: (response) => {
          this.menus = response.menu;
          console.log(this.menus)
        },
        error: (error) => {
          console.error('Erro: ', error);
        }
      })
  }

  capitalizeFirstLetter(str: string): string {
    if (!str) return ''; // Verifica se a string é válida
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

}
