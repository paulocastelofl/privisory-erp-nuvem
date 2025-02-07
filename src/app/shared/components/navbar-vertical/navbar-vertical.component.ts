import { Component, Input } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar-vertical',
  standalone: false,
  templateUrl: './navbar-vertical.component.html',
  styleUrl: './navbar-vertical.component.scss'
})

export class NavbarVerticalComponent {

  @Input() public subjectIsOpenMenu = new BehaviorSubject<boolean>(true);
  public hasOpenOrClose: boolean = true;
  public menus: any[] = [];

  constructor(
    private _service: GenericHttpService<any>,
  ) { }


  ngOnInit(): void {
    this.getMenus();
    this.subjectIsOpenMenu.subscribe({
      next: (value) => {
        console.log(value)
        this.hasOpenOrClose = value
      } 
    });
  }
  getMenus() {
    this._service.get('Menu')
      .subscribe({
        next: (response) => {
          this.menus = response.menu;
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
