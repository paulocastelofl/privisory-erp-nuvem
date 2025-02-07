export interface IDataTableConfig {
    paging?: boolean;
    searching?: boolean;
    responsive?: boolean;
    dom?: string;
    language?: {
      sEmptyTable?: string;
      sInfo?: string;
      sInfoEmpty?: string;
      sInfoFiltered?: string;
      sInfoPostFix?: string;
      sInfoThousands?: string;
      sLengthMenu?: string;
      sLoadingRecords?: string;
      sProcessing?: string;
      sZeroRecords?: string;
      sSearch?: string;
      oPaginate?: {
        sNext: string;
        sPrevious: string;
        sFirst: string;
        sLast: string;
      };
      oAria?: {
        sSortAscending: string;
        sSortDescending: string;
      };
    };
    pagingType?: string;
    pageLength?: number;
    displayStart?: number;
    search?: { search: string };
    serverSide?: boolean;
    processing?: boolean;
    autoWidth?: boolean;
    ordering?: boolean;
    lengthMenu?: string[];
    ajax: (dataTablesParameters: any, callback: (data: any) => void) => void;
    columns: {
      title: string;
      data: string | null;
      width?: string;
      orderable?: boolean;
      render?: (data: any, type: any, row: any) => string;
    }[];
  }
  