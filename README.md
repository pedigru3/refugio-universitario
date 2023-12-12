# Refúgio Universitário

## Descrição do Projeto

O **[Refúgio Universitário](https://refugiouniversitario.com.br/)** é um projeto dedicado a proporcionar um ambiente propício para estudos em grupo para estudantes universitários. Através deste site, os usuários podem agendar um dia e horário de sua escolha para reservar uma mesa individual ou para o grupo de estudo.

## Funcionalidades

- **Reserva de Mesas:** Os usuários podem navegar pelo calendário disponível e selecionar a data desejada para reserva.
- **Escolha de Mesa:** Oferecemos a opção de escolher entre mesas individuais ou para grupos, garantindo uma experiência personalizada.
- **Notificações por E-mail:** Os usuários receberão notificações por e-mail para confirmar a reserva e lembrar da data agendada.
- **Perfil do Usuário:** Cada usuário tem seu próprio perfil, onde podem visualizar histórico de reservas, editar preferências e informações pessoais.

## Como Utilizar

1. **Cadastro:** Para começar, crie uma conta no Refúgio Universitário, fornecendo informações básicas.
2. **Navegação:** Explore o calendário para verificar disponibilidade.
3. **Reserva:** Selecione a data desejada e escolha entre mesa individual ou para grupo.
4. **Confirmação:** Receba uma confirmação por e-mail e mantenha-se informado sobre seus agendamentos.

## Instalação Local

Para rodar o projeto localmente, certifique-se de ter o Docker instalado em sua máquina. Se você ainda não tem o Docker instalado, você pode baixá-lo [aqui](https://www.docker.com/get-started). Você também precisará de uma conta na Google Cloud Platform para conseguir o GOOGLE CLIENT ID e o GOOGLE SECRET ID.

Depois, siga os passos abaixo:

1. Clone este repositório:
```bash
  git clone https://github.com/pedigru3/refugio-universitario.git
```

2. Instale as dependências:
```bash
    cd refugio-universitario
    npm install
```

3. Copie o arquivo .exemple.env para .env e preencha os campos que faltam.

4. Habilite o Google Calendar API e pegue os ID's:
- Acesse[Google Cloud Console](https://console.cloud.google.com/).
- Crie um novo projeto web.
- Navegue até "API e Serviços" > "Biblioteca".
- Pesquise e ative "Google Calendar API"
- Depois, vá para "API e Serviços" > "Credenciais".
- Clique em "Criar Credenciais" e selecione "ID do Cliente OAuth".
- Em URI autorizadas coloque seu endereço local: http://localhost:3000
- Em URI de redirecionamento, coloque http://localhost:3000/api/auth/callback/google

4. Inicie o servidor local:
```bash 
    npm run dev
```

Acesse http://localhost:3000 para visualizar o Refúgio Universitário localmente.

## Licença
Este projeto é licenciado sob a Licença MIT.