import { Component } from '@angular/core';
declare var $: any;
import 'datatables.net';
import { GenericHttpService } from '../../../services/generic-http.service';
import { IUsuario } from '../../../helpers/models/IUsusario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-usuarios',
  standalone: false,
  templateUrl: './listar-usuarios.component.html',
  styleUrl: './listar-usuarios.component.scss'
})
export class ListarUsuariosComponent {

  modelusuarios: IUsuario[] = [];
  dtOptions: any = {
  };
  /**
   *
   */
  constructor(private _service: GenericHttpService<any>,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    let lastPage = 0;
    let lastSearchText = "";
    this.dtOptions = {
      paging: true,
      searching: false,
      responsive: true,
      dom: '<"top"f>rt<"length-section"l><"bottom"p>',
      language: {
        sEmptyTable: 'Nenhum registro encontrado',
        sInfo: 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
        sInfoEmpty: 'Mostrando 0 até 0 de 0 registros',
        sInfoFiltered: '(Filtrados de _MAX_ registros)',
        sInfoPostFix: '',
        sInfoThousands: '.',
        sLengthMenu: '_MENU_ resultados por página',
        sLoadingRecords: 'Carregando...',
        sProcessing: 'Processando...',
        sZeroRecords: 'Nenhum registro encontrado',
        sSearch: 'Pesquisar',
        oPaginate: {
          sNext: '<i class="fa fa-chevron-right"></i>',
          sPrevious: '<i class="fa fa-chevron-left"></i>',
          sFirst: 'Primeiro',
          sLast: 'Último',
        },
        oAria: {
          sSortAscending: ': Ordenar colunas de forma ascendente',
          sSortDescending: ': Ordenar colunas de forma descendente',
        },
      },
      pagingType: 'simple_numbers',
      pageLength: 10,
      displayStart: lastPage, // Last Selected Page
      search: { search: lastSearchText }, // Last Searched Text
      serverSide: true,
      processing: true,
      autoWidth: false,
      ordering: true,
      lengthMenu: ['5', '10', '20'],
      ajax: (dataTablesParameters: any, callback: any) => {
        lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
        lastSearchText = dataTablesParameters.search.value;
        this._service.getDataTableResponse(dataTablesParameters).then((resp: any) => {
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
        { title: 'Usuário', data: 'loginUsuario' },

      ],
    };

  }

  ngAfterViewInit(): void {
    // Editar
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