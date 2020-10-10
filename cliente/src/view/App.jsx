//@flow
import React, { useEffect, useReducer } from 'react'
import jwt from 'jsonwebtoken'

import Login from './Login.jsx'
import PublicaLembrete from './PublicaLembrete.jsx'
import MostraLembretes from './MostraLembretes.jsx'
import Autores from './Autores.jsx'

import 'bulma/css/bulma.min.css'

import type { Token, TokenDecodificado } from '../tipos_flow'

const autores = [{ nome: 'Augusto Silva de Oliveira', matricula: '19100852' }, { nome: '', matricula: '' }, { nome: '', matricula: '' }, { nome: '', matricula: '' }]


type Estado = {
  token: Token | void,
  tokenDecodificado: TokenDecodificado  | void,
  mostrandoAutores: boolean,
  autores: Array<Autor>
}

type Acao =
  { type: 'REGISTRE_TOKEN', token: Token, tokenDecodificado: TokenDecodificado }
  | { type: 'RECEBA_NOVO_TOKEN', token: Token }
  | { type: 'REGISTRE_USUARIO_SAIU' }
  | { type: 'MOSTRE_AUTORES' }
  | { type: 'ESCONDA_AUTORES' }


const estadoInicial: Estado = {
  token: undefined,
  tokenDecodificado: undefined,
  mostrandoAutores: false,
  autores: autores
}

function reducer(estado: Estado, acao: Acao): Estado {
  switch (acao.type) {
    case 'REGISTRE_TOKEN':
      return { ...estado, token: acao.token, tokenDecodificado: acao.tokenDecodificado }

    case 'RECEBA_NOVO_TOKEN':
      return { ...estado, token: acao.token, tokenDecodificado: jwt.decode(acao.token) }

    case 'REGISTRE_USUARIO_SAIU':
      return estadoInicial

    case 'MOSTRE_AUTORES':
      return { ...estado, mostrandoAutores: true }

    case 'ESCONDE_AUTORES':
      return { ...estado, mostrandoAutores: false }

    default:
      throw new Error(`BUG: acao.type inválido: ${acao.type}`)
  }
}

function tokenValido(tokenDecodificado: TokenDecodificado): boolean {
  const agora: number = Date.now()
  const exp = tokenDecodificado.exp * 1000
  return agora < exp
}

// FIXME Não há nade de errado com esta aplicação. A tarefa consiste em
// colocar a aplicação na sua máquina virtual na nuvem da UFSC.

function App() {
  const [estado, dispatch] = useReducer(reducer, estadoInicial)

  function mostreAutores() {
    dispatch({ type: 'MOSTRE_AUTORES' })

  }

  function escondeAutores() {
    dispatch({ type: 'ESCONDE_AUTORES' })
  }

  useEffect(() => {
    let token = window.localStorage.getItem('token')
    let tokenDecodificado

    if (token === null)
      token = undefined
    else {
      tokenDecodificado = jwt.decode(token)
      if (tokenValido(tokenDecodificado))
        dispatch({ type: 'REGISTRE_TOKEN', token, tokenDecodificado })
      else
        window.localStorage.removeItem('token')
    }
  }, [])

  useEffect(() => {
    if (estado.token !== undefined) {
      window.localStorage.setItem('token', estado.token)
    }
    else {
      window.localStorage.removeItem('token')
    }
  }, [estado.token])


  return (
    <div className='container is-fluid'>
      <div className='message'>
        <div className='message-header'>
          UFSC - CTC - INE - INE5646 :: App lembretes
        </div>
        {estado.mostrandoAutores ? <Autores escondeAutores={escondeAutores} estado={estado}></Autores> :
          <div className='message-body'>
            {
              estado.token &&
              <button className='button is-warning' onClick={mostreAutores}>Mostrar Autores</button>
            }
            <Login onToken={token => dispatch({ type: 'RECEBA_NOVO_TOKEN', token })}
              onSaiu={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })}
              token={estado.token}
              tokenDecodificado={estado.tokenDecodificado} />

            {
              estado.token &&
              <PublicaLembrete token={estado.token}
                onTokenInvalido={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })} />
            }
            {
              estado.token &&
              <MostraLembretes token={estado.token}
                onTokenInvalido={() => dispatch({ type: 'REGISTRE_USUARIO_SAIU' })} />
            }
          </div>}
      </div>
    </div>
  )
}

export default App
