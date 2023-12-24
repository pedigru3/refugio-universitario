import Image from 'next/image'
import * as React from 'react'

interface EmailTemplateProps {
  firstName: string
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <table
      width="100%"
      className="font-sans max-w-[600px] mx-auto bg-white rounded-md shadow
      "
    >
      <tr>
        <td className="p-7">
          <h1 className="text-gray-700 font-bold text-3xl mb-5">
            Bem-Vindo ao Refúgio Universitário!
          </h1>
          <img
            src="https://www.refugiouniversitario.com.br/_next/image?url=%2Frefugio-universitario.png&w=1200&q=75"
            alt="Refúgio Universitário"
            className="block mx-auto mb-5 max-w-full"
          />
          <p className="text-gray-700 text-lg mb-2">{firstName},</p>
          <p className="text-gray-700 text-lg mb-2">
            É com grande alegria que damos as boas-vindas ao{' '}
            <strong> Refúgio Universitário </strong>, um lugar de estudo
            compartilhado projetado para inspirar e facilitar o seu percurso
            acadêmico.
          </p>
          <p className="text-gray-700 text-lg mb-2">
            Aqui, você terá acesso a um ambiente propício para o{' '}
            <strong> aprendizado, colaboração e crescimento acadêmico. </strong>
            Estamos comprometidos em fornecer recursos de alta qualidade para
            apoiar seus estudos.
          </p>
          <p className="text-gray-700 text-lg mb-2">
            Pronto para começar sua jornada de aprendizado? Clique no botão
            abaixo para acessar o Refúgio Universitário agora mesmo!
          </p>
          <p className="w-full mx-auto mb-2">
            <a
              href="[Link de Acesso]"
              className="block py-4 px-7 my-5 mx-auto bg-purple-600 text-white text-center rounded-md text-lg mb-2"
            >
              Acessar o Refúgio Universitário
            </a>
          </p>
          <p className="text-gray-700 text-lg mb-2">
            Estamos animados para fazer parte da sua jornada educacional e
            ansiosos para ver seus sucessos no Refúgio Universitário.
          </p>
          <p className="text-gray-700 text-lg mb-2">
            Se precisar de qualquer assistência ou tiver alguma dúvida, não
            hesite em entrar em contato conosco. Boa sorte em seus estudos!
          </p>
          <p className="text-gray-700 text-lg">Atenciosamente,</p>
          <p className="text-gray-700 text-lg mb-2">Felipe Ferreira</p>
        </td>
      </tr>
    </table>
  )
}
