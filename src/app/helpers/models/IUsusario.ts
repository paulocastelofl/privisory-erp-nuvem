export interface IUsuario {
    idUsuario?: number
    idEmpresa?: number
    idPessoa?: number
    loginUsuario?: string
    senha?: string
    usuarioMaster?: number
    ativo?: number
    nome?: string
    loginSistema?: number
    ehVendedor?: number
    usaPdvComoUtilitario?: number
    ehComandaEletronica?: number
    ehEntregador?: number
    ehTecnico?: number
    hashUsuario?: string
    senhaHash?: string
    telefone?: string,
    observacoes?:string,
    rg?: string,
    cpf?: string
}
