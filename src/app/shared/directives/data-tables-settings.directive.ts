import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
import 'datatables.net';
import { IDataTableConfig } from '../../helpers/models/DataTableConfig';

@Directive({
  selector: '[appDataTablesSettings]',
  standalone: false
})
export class DataTablesSettingsDirective implements OnInit, OnDestroy {

  @Input() dtOptions: IDataTableConfig | undefined;
  private dataTable: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const defaultOptions: IDataTableConfig = {
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
      displayStart: 0,
      search: { search: "" },
      serverSide: true,
      processing: true,
      autoWidth: false,
      ordering: true,
      lengthMenu: ['5', '10', '20'],
      ajax: () => {},
      columns: []
    };

    const finalOptions: IDataTableConfig = { 
      ...defaultOptions, 
      ...this.dtOptions,
      language: { ...defaultOptions.language, ...this.dtOptions?.language },
    };

    this.dataTable = $(this.el.nativeElement).DataTable(finalOptions);
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy(true); // Remove a tabela do DOM
    }
  }
}
