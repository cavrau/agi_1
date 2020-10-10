//@flow
import React, { useState, useEffect } from 'react'

import * as s from '../servicos'

import type { Token, TokenDecodificado } from '../tipos_flow'





function Autores(props: Props) {

    const [autores, setAutores] = useState([])
    useEffect(() => {
        s.leAutores(props.estado.token).then(autores => setAutores(autores))
    }, [])


    return (

        <div className='container is-fluid'>


            <article className='message is-info'>
                <div className='message-header'>
                    <p>Autores</p>
                </div>
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nome</th>
                                <th>Matricula</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                autores.map((autor, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{autor.nome}</td>
                                        <td>{autor.matricula}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <button className="button is-success" onClick={props.escondeAutores}>Ok</button>
                </div>
            </article>
        </div>
    )
}

export default Autores