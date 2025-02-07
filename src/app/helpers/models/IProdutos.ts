export interface IProdutoFoto {
  idProdutoFoto?: number
  idProduto?: number
  nomeArquivo?: string
  grande?: string
  principal?: number
  s3?: number
}

export interface IProduto {
    idProduto?: number
    nomeProduto?: string
    codigoBarras?: string
    pesoGramas?: number
    percentualMargemLucro?: number
    ativo?: number
    vendeSemEstoque?: number
    vendeSobEncomenda?: number
    codigoInterno?: string
    precoCustoAutomatico?: number
    precoCusto?: number
    precoVenda?: number
    estoqueCompartilhado?: number
    permiteEmbalagemPresente?: number
    flagMaisVendido?: number
    idProdutoVariacao?: number
    idEmpresa?: number
    flagDisponivelLojaVirtual?: number
    vendeAssinatura?: number
    ncm?: string
    unidadeTributavel?: string
    ultimaAlteracao?: string
    exportaCasaValentina?: number
    vendaFracionada?: number
    usabalanca?: number
    idProdutoUnidade?: number
    produtoEhKit?: number
    hashProduto?: string
    solicitaPrecoVendaPdv?: number
    produtoGenerico?: number
    usaBalancaEtiquetadora?: number
    flagServico?: number
    flagMateriaPrima?: number
    solicitaLote?: number
    ehGalaoAgua?: number
    dataCadastro?: string
    imprimeDataValidade?: number
    produtofotos?: IProdutoFoto[]
  }
  
  