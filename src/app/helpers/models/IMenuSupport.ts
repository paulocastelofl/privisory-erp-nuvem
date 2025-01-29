export interface MenuSupport {
    titulo?: string
    nome?: string
    url?: string
    icone: string
    submenu?: Submenu[]
}

export interface Submenu {
    titulo?: string
    nome?: string
    url?: string
}
