import { Component } from '@angular/core';
import { GenericHttpService } from '../../../services/generic-http.service';
import { Router } from '@angular/router';
import 'datatables.net';
import { IProduto } from '../../../helpers/models/IProdutos';
import { IDataTableConfig } from '../../../helpers/models/DataTableConfig';
declare var $: any;

@Component({
  selector: 'app-listar-produtos',
  standalone: false,
  templateUrl: './listar-produtos.component.html',
  styleUrl: './listar-produtos.component.scss'
})
export class ListarProdutosComponent {

  public lbFilterlSearch: string = "";
  public produtos: IProduto[] = [];
  public dtOptions: IDataTableConfig | undefined;

  constructor(private _service: GenericHttpService<any>,
    private readonly _router: Router) {
  }

  ngOnInit(): void {
    this.getDataProdutos();
  }

  getDataProdutos() {
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.lbFilterlSearch = this.lbFilterlSearch;
        this._service.getDataTableResponse(dataTablesParameters, '/produto/DataTableProdutos').then((resp: any) => {
          this.produtos = resp.data;
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
            <a class="dropdown-item editar-produto" data-id="${row.idProduto}"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>`;
          }
        },
        { title: 'Código', data: 'idProduto', width: '10%' },
        { title: 'Nome', data: 'nomeProduto' },
        {
          title: 'Preço de Venda', data: 'precoVenda', width: '12%',
          render: (data: any) => {
            return data ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data) : 'R$ 0,00';
          }
        }
      ],
    };
  }

  refreshTable() {
    $('#dataTableProdutos').DataTable().ajax.reload(null, false);
  }

  ngAfterViewInit(): void {
    $('#dataTableProdutos').on('click', '.editar-produto', (event: any) => {
      const id = $(event.currentTarget).data('id');
      const produto = this.produtos.find((c: IProduto) => c.idProduto === id);
      this._router.navigate([`produtos/${produto?.hashProduto}`]); // Navega para a tela de edição
    });
  }

  goNewProduto = () => this._router.navigate(['/produtos/novo']);
}
