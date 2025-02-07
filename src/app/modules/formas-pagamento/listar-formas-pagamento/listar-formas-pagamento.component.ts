import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { Router } from '@angular/router';
import { IDataTableConfig } from '../../../helpers/models/DataTableConfig';
import 'datatables.net';
declare var $: any;

@Component({
  selector: 'app-listar-formas-pagamento',
  standalone: false,

  templateUrl: './listar-formas-pagamento.component.html',
  styleUrl: './listar-formas-pagamento.component.scss'
})
export class ListarFormasPagamentoComponent {

  public lbFilterlSearch: string = "";
  public formasPagamento: any[] = [];
  public dtOptions: IDataTableConfig | undefined;

  constructor(private _service: GenericHttpService<any>,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.getDataFormasPagamento();
  }

  getDataFormasPagamento() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.lbFilterlSearch = this.lbFilterlSearch;
        this._service.getDataTableResponse(dataTablesParameters, '/formaPagamento/DataTableFormaPagamento').then((resp: any) => {
          this.formasPagamento = resp.data;
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
              <a class="dropdown-item editar-forma-pagamento" data-id="${row.idFormaPagamento}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>`;
          }
        },
        { title: 'Descrição', data: 'descricao' }
      ],
    };
  }

  refreshTable() {
    $('#dataTableFormaPagamento').DataTable().ajax.reload(null, false);
  }

  ngAfterViewInit(): void {
    $('#dataTableFormaPagamento').on('click', '.editar-forma-pagamento', (event: any) => {
      const id = $(event.currentTarget).data('id');
      const formaPagamento = this.formasPagamento.find((c: any) => c.idFormaPagamento === id);
      this._router.navigate([`formas-pagamento/${formaPagamento?.hashRegistro}`]); // Navega para a tela de edição
    });
  }

  goNewFormaPagamento = () => this._router.navigate(['/formas-pagamento/novo']);
}
