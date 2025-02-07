import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { IUsuario } from '../../../helpers/models/IUsusario';
import { Router } from '@angular/router';
declare var $: any;
import 'datatables.net';
import { IDataTableConfig } from '../../../helpers/models/DataTableConfig';

@Component({
  selector: 'app-listar-usuarios',
  standalone: false,
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss'
})
export class ListarUsuariosComponent {

  public lbFilterlSearch: string = "";
  public modelusuarios: IUsuario[] = [];
  public dtOptions: IDataTableConfig | undefined;

  constructor(private _service: GenericHttpService<any>,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.getDataUsuarios();
  }

  getDataUsuarios() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.lbFilterlSearch = this.lbFilterlSearch;
        this._service.getDataTableResponse(dataTablesParameters, '/usuarios/DataTableUsuarios').then((resp: any) => {
          this.modelusuarios = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsTotal,
            data: resp.data
          });
        });
      },
      columns: [
        {
          title: 'Ações',
          data: null,
          width: '5%',
          orderable: false,
          render: (data: any, type: any, row: any) => {
            return `
            <a class="dropdown-item editar-usuario" data-id="${row.idUsuario}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>`;
          }
        },
        { title: 'Código', data: 'idUsuario', width: '10%' },
        { title: 'Nome', data: 'nome' },
        { title: 'Usuário', data: 'loginUsuario' }
      ],
    };
  }

  refreshTable() {
    $('#dataTableUsuario').DataTable().ajax.reload(null, false); // false mantém a página atual
  }

  ngAfterViewInit(): void {
    $('#dataTableUsuario').on('click', '.editar-usuario', (event: any) => {
      const id = $(event.currentTarget).data('id');
      const usuario = this.modelusuarios.find((c: IUsuario) => c.idUsuario === id);
      this._router.navigate([`usuarios/${usuario?.hashUsuario}`]); // Navega para a tela de edição
    });

    // Deletar
    $('#dataTableUsuario').on('click', '.deletar-usuario', (event: any) => {
      const id = $(event.currentTarget).data('id');
    });
  }

  goNewUsuario = () => this._router.navigate(['/usuarios/novo']);
}