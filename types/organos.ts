export interface Organo {
  id: string
  nombre: string
  path: string
  color: string
  descripcion: string
  cuidados?: {
    titulo: string
    lista: string[]
  }
  consecuencias?: string[]
}

export interface PuntoColumna {
  id: string
  nombre: string
  cx: number
  cy: number
  descripcion: string
  cuidados?: {
    titulo: string
    lista: string[]
  }
  consecuencias?: string[]
}

export interface PuntoRelajacion {
  id: string
  nombre: string
  cx: number
  cy: number
  descripcion: string
  tecnica: string
}

export interface Musculo {
  id: string
  nombre: string
  path: string
  color: string
  class: string
  descripcion: string
  funcion: string
}