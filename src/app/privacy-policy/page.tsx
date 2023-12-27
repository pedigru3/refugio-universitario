import { Title } from '@/components/title'

export default function PrivacyPolicy() {
  return (
    <div className="max-w-[600px] mx-auto mt-8 px-10">
      <h1 className="text-2xl md:text-3xl text-white mb-5 font-bold">
        Política de Privacidade - Refúgio Universitário
      </h1>

      {/* Seção 1: Informações Coletadas */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          1. Informações Coletadas:
        </h2>
        <p>
          1.1. <strong>Informações de Cadastro:</strong> Ao se registrar no
          Refúgio Universitário, coletamos informações básicas, como nome,
          endereço de e-mail, e informações de contato.
        </p>
        <p>
          1.2. <strong>Informações de Reserva:</strong> Ao efetuar uma reserva,
          coletamos informações sobre a data selecionada, tipo de mesa escolhida
          (individual ou para grupo) e outras informações relacionadas à
          reserva.
        </p>
        <p>
          1.3. <strong> Informações de Perfil:</strong> Os usuários têm a opção
          de criar um perfil onde podem visualizar o histórico de reservas,
          editar preferências e informações pessoais.
        </p>
        <p>
          1.4. <strong> Cookies e Tecnologias Semelhantes:</strong> Utilizamos
          cookies e tecnologias similares para melhorar a experiência do
          usuário, analisar tendências e administrar o site.
        </p>
      </section>

      {/* Seção 2: Uso das Informações */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Uso das Informações:</h2>
        <p>
          2.1. <strong>Fornecimento de Serviços:</strong> Utilizamos as
          informações coletadas para oferecer e gerenciar os serviços do Refúgio
          Universitário, incluindo reservas de mesas e notificações por e-mail.
        </p>
        <p>
          2.2. <strong>Personalização:</strong> Utilizamos as informações
          coletadas para oferecer e gerenciar os serviços do Refúgio
          Universitário, incluindo reservas de mesas e notificações por e-mail.
        </p>
        <p>
          2.3. <strong>Comunicações:</strong> Podemos enviar e-mails de
          confirmação de reservas, atualizações sobre o site e informações
          relevantes para os usuários.
        </p>
      </section>

      {/* Seção 3: Compartilhamento de Informações */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          3. Compartilhamento de Informações:
        </h2>
        <p>
          3.1. <strong>Parceiros e Prestadores de Serviços:</strong> Podemos
          compartilhar informações com parceiros e prestadores de serviços para
          facilitar reservas e melhorar nossos serviços.
        </p>
        <p>
          3.2. <strong>Calendário Google: </strong> Ao reservar, as informações
          serão sincronizadas com o Calendário do Google.
        </p>
        {/* Adicione outras subseções conforme necessário */}
      </section>

      {/* Seção 4: Segurança das Informações */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          4. Segurança das Informações:
        </h2>
        <p>
          Implementamos medidas de segurança para proteger as informações dos
          usuários contra acesso não autorizado, alteração, divulgação ou
          destruição não autorizada.
        </p>
      </section>

      {/* Seção 5: Seus Direitos */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Seus Direitos:</h2>
        <p>
          Os usuários têm o direito de acessar, corrigir ou excluir suas
          informações pessoais. Para exercer esses direitos, entre em contato
          conosco por meio das informações fornecidas no final desta política.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          6. Alterações na Política:
        </h2>
        <p>
          Esta Política de Privacidade pode ser atualizada periodicamente.
          Enviaremos um e-mail caso haja quaisquer alterações.
        </p>
      </section>

      {/* Rodapé */}
      <footer className="text-sm text-gray-400">
        <p>Última atualização: 27/12/2023</p>
        <p>
          Para esclarecimento de dúvidas, entre em contato pelo e-mail:{' '}
          <a href="mailto:ferreira.contato1@gmail.com">
            ferreira.contato1@gmail.com
          </a>
        </p>
      </footer>
    </div>
  )
}
