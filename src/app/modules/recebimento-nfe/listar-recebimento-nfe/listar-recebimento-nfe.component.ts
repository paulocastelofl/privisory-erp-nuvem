import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { Router } from '@angular/router';
import { IDataTableConfig } from '../../../helpers/models/DataTableConfig';
import 'datatables.net';
declare var $: any;

@Component({
  selector: 'app-listar-recebimento-nfe',
  standalone: false,

  templateUrl: './listar-recebimento-nfe.component.html',
  styleUrl: './listar-recebimento-nfe.component.scss'
})
export class ListarRecebimentoNfeComponent {

  public lbFilterlSearch: string = "";
  public notasFiscal: any[] = [];
  public dtOptions: IDataTableConfig | undefined;

  constructor(private _service: GenericHttpService<any>,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.getDataNotasFiscal();
  }

  getDataNotasFiscal() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.lbFilterlSearch = this.lbFilterlSearch;
        this._service.getDataTableResponse(dataTablesParameters, '/NotaFiscal/DataTableNotaFiscal').then((resp: any) => {
          console.log(resp.data)
          this.notasFiscal = resp.data;
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
              <a class="dropdown-item editar-nota-fiscal" data-id="${row.idNotaFiscal}"><i class="fa fa-eye" aria-hidden="true"></i></a>`;
          }
        },
        {
          title: 'Nome',
          data: 'idFornecedorNavigation',
          render: (data: any) => {
            return data && data.nomeRazao ? data.nomeRazao : '-';
          }
        }
        ,
        { title: 'Nº Nota Fiscal', data: 'numeroNf', width: '20%' },
        {
          title: 'Valor Total', data: 'valorTotal', width: '10%',  render: (data: any) => {
            return data ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data) : 'R$ 0,00';
          }
        },
        {
          title: 'Data Emissão', data: 'dataEmissao',  width: '20%', render: (data: any) => {
            if (!data) return '-';
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          }
        }
      ],
    };
  }

  refreshTable() {
    $('#dataTableNotasFiscal').DataTable().ajax.reload(null, false);
  }

  ngAfterViewInit(): void {
    $('#dataTableNotasFiscal').on('click', '.editar-nota-fiscal', (event: any) => {
      const id = $(event.currentTarget).data('id');
      const notaFiscal = this.notasFiscal.find((c: any) => c.idNotaFiscal === id);
      this._router.navigate([`recebimento-nfe/${notaFiscal?.hashRegistro}`]); // Navega para a tela de edição
    });
  }

  goNewFRecebimentoNfe = () => this._router.navigate(['/recebimento-nfe/novo']);

}
