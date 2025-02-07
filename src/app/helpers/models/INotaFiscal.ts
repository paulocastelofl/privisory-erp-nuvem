export interface INotaFiscal {
    idNotaFiscal: number
    idEmpresa: number
    dataEmissao: string
    idPessoaEndereco: number
    idFuncionarioLogin: number
    numeroNf: string
    serie: string
    estornada: number
    informacoesAdicionais: string
    enviadaSefaz: number
    dataEnvioSefaz: string
    idPessoaFornecedor: number
    dataRecebimento: string
    valorTotal: number
    nomearquivo: string
    numeroReciboNfe: string
    chaveNfe: string
    quantidadeVolumes: number
    modalidadeFrete: number
    pesoBruto: number
    pesoLiquido: number
    contapagarrecebers: any[]
    idPessoaEnderecoNavigation: IdPessoaEnderecoNavigation
    idFornecedorNavigation: IdFornecedorNavigation
    notafiscalcartacorrecaos: any[]
    notafiscalitems: Notafiscalitem[]
    notafiscalparcelas: any[]
  }

  export interface IdFornecedorNavigation {
    idPessoa: number
    idPessoaTipo: number
    nomeRazao: string
    apelidoFantasia: string
    cpfcnpj: string
    rgie: string
    ativa: number
    hashPessoa: string
    idEmpresa: number
    ehcliente: number
    ehfornecedor: number
    ehfuncionario: number
    ehTransportadora: number
    ehRepresentante: number
    ehConsumidor: number
    ehAutor: number
    ehProfissional: number
  }
  
  
  export interface IdPessoaEnderecoNavigation {
    idPessoaEndereco: number
    idPessoa: number
    numero: string
    endereco: string
    bairro: string
    cidade: string
    cep: string
    hashPessoa: string
    hashEndereco: string
    enderecoPrincipal: number
    notafiscals: any[]
  }
  
  export interface Notafiscalitem {
    idNotaFiscalItem: number
    idNotaFiscal: number
    cfop: string
    codigoProdutoNfe: string
    quantidade: number
    numeroItem: number
    codigoBarras: string
    ncm: string
    precoCusto: number
    nomeProduto: string
    nlote: string
    dfab: string
    dval: string
    cprodAnvisa: string
    xmotivoIsencao: string
    vpmc: number
  }
  