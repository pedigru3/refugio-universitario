import { Container } from '@/components/container'
import Link from 'next/link'

export default function TermOfService() {
  return (
    <Container>
      <div className="pt-10 pb-8">
        <h1 className="text-2xl md:text-3xl text-white mb-5 font-bold">
          Termos de Serviço - Refúgio Universitário
        </h1>
        <p className="mb-8">
          Bem-vindo ao Refúgio Universitário. Antes de utilizar nossos serviços,
          por favor, leia atentamente os seguintes Termos de Serviço.
        </p>

        {/* Seção 1: Informações Coletadas */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            1. Aceitação dos Termos:
          </h2>
          <p>
            Ao acessar ou utilizar os serviços oferecidos pelo Refúgio
            Universitário, você concorda em obedecer a estes Termos de Serviço.
            Se você não concordar com algum dos termos aqui presentes, por
            favor, não utilize nossos serviços.
          </p>
        </section>

        {/* Seção 2: Uso das Informações */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Uso dos Serviços:</h2>
          <p>
            2.1. <strong>Cadastro:</strong> Para acessar determinadas
            funcionalidades do Refúgio Universitário, você pode ser solicitado a
            criar uma conta. As informações fornecidas durante o processo de
            cadastro devem ser precisas e atualizadas.
          </p>
          <p>
            2.2. <strong>Reservas:</strong> Os usuários podem utilizar nossos
            serviços para agendar mesas individuais ou para grupos. Ao fazer uma
            reserva, você concorda em respeitar as{' '}
            <Link className="underline" href={'/privacy-policy'}>
              políticas e termos específicos de reserva.
            </Link>
          </p>
        </section>

        {/* Seção 3. Responsabilidades do Usuário: */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            3. Responsabilidades do Usuário:
          </h2>
          <p>
            3.1. <strong>Uso adequado:</strong> Ao utilizar nossos serviços,
            você concorda em não violar leis aplicáveis e regulamentos. Você é
            responsável por todas as atividades associadas à sua conta.
          </p>
          <p>
            3.2. <strong>Informações Pessoais: </strong> É de sua
            responsabilidade fornecer informações precisas e atualizadas. O
            Refúgio Universitário não se responsabiliza por informações
            incorretas ou desatualizadas fornecidas pelos usuários.
          </p>
          {/* Adicione outras subseções conforme necessário */}
        </section>

        {/* Seção 4: Segurança das Informações */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Privacidade</h2>
          <p>
            O Refúgio Universitário valoriza a privacidade dos usuários. Para
            mais informações sobre como tratamos seus dados, consulte nossa{' '}
            <Link className="underline" href={'/privacy-policy'}>
              Política de Privacidade.
            </Link>
          </p>
        </section>

        {/* Seção 5: Modificações nos Serviços: */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            5. Modificações nos Serviços:
          </h2>
          <p>
            O Refúgio Universitário reserva-se o direito de modificar ou
            descontinuar qualquer parte dos serviços a qualquer momento.
            Informaremos os usuários sobre alterações significativas, quando
            aplicável.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            6. Limitação de Responsabilidade:
          </h2>
          <p>
            Em nenhuma circunstância o Refúgio Universitário, seus
            proprietários, funcionários ou afiliados serão responsáveis por
            quaisquer danos diretos, indiretos, incidentais, especiais ou
            consequenciais decorrentes do uso ou da incapacidade de usar nossos
            serviços.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            7. Alterações nos Termos de Serviço:
          </h2>
          <p>
            Estes Termos de Serviço podem ser atualizados periodicamente.
            Recomendamos que os usuários revejam regularmente os termos para
            estar cientes de quaisquer alterações.
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
    </Container>
  )
}
