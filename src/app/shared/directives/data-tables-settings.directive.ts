import { Directive, ElementRef, Input } from '@angular/core';
declare var $: any;
import 'datatables.net';

@Directive({
  selector: '[appDataTablesSettings]',
  standalone: false
})
export class DataTablesSettingsDirective {

  @Input() dtOptions = {};
  private dataTable: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.dataTable = $(this.el.nativeElement).DataTable(this.dtOptions);
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy(true); // Remove a tabela do DOM
    }
  }

}
