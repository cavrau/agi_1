//@flow

export type Token = string

export type TokenDecodificado = { login: string, iat: number, exp: number }

export type Lembrete = {
    _id: string,
    texto: string
}

export type Autor = {
    nome: string,
    matricula: number
  }