# Refúgio Universitário

## Descrição do Projeto

O **[Refúgio Universitário](https://refugiouniversitario.com.br/)** é um projeto dedicado a proporcionar um ambiente propício para estudos em grupo para estudantes universitários. Através deste site, os usuários podem agendar um dia e horário de sua escolha para reservar uma mesa individual ou para o grupo de estudo.

## Funcionalidades

- **Escolha de data:** Os usuários podem navegar pelo calendário disponível e selecionar a data desejada para reserva.
- **Reserva de Mesa:** Oferecemos a opção de escolher entre mesas individuais ou para grupos, garantindo uma experiência personalizada.
- **Calendário Google:** Ao reservar o estudo, os usuários poderão ver o evento no Calendário do Google. 
- **Perfil do Usuário:** Cada usuário tem seu próprio perfil, onde podem visualizar histórico de reservas, editar preferências e informações pessoais.

## Como Utilizar

1. **Cadastro:** Para começar, crie uma conta no Refúgio Universitário, fornecendo informações básicas.
2. **Navegação:** Explore o calendário para verificar disponibilidade.
3. **Reserva:** Selecione a data desejada e escolha entre mesa individual ou para grupo.
4. **Confirmação:** Receba uma confirmação por e-mail e mantenha-se informado sobre seus agendamentos.

## Instalação Local

Para rodar o projeto localmente, certifique-se de ter o Docker instalado em sua máquina. Se você ainda não tem o Docker instalado, você pode baixá-lo [aqui](https://www.docker.com/get-started). Você também precisará de uma conta na Google Cloud Platform para conseguir o GOOGLE CLIENT ID e o GOOGLE SECRET ID. Para utilizar o serviço de e-mail, será necessário uma conta no [Resend](https://resend.com/)

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

5. Habilite o Serviço de e-mail.
- Crie uma conta no [Resend](https://resend.com/)
- Crie um token e coloque no arquivo .env na variável RESEND_API_KEY

6. Inicie o servidor local:
```bash 
    npm run dev
```

Acesse http://localhost:3000 para visualizar o Refúgio Universitário localmente.

## Progresso

- [x] Criação de usuários e login com Google
- [x] Conexão com Google Calendar
- [x] Realização de agendamentos
- [x] Página de Perfil de usuário
- [x] Funções Admin e User / Página administrativa
- [ ] Usuário deve poder deslogar da conta
- [ ] Usuário deve poder editar o perfil

- Em desenvolvimento...💡

## 🦸 Autor

 <img style="border-radius: 50%;" src="https://github.com/pedigru3.png" width="100px;" alt="Felipe Ferreira"/>
 <sub><b>Felipe Ferreira</b></sub> 🚀

[![Gmail Badge](https://img.shields.io/badge/-ferreira.contato1@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:ferreira.contato1@gmail.com)](mailto:ferreira.contato1@gmail.com)

---

Feito com 💜 por Felipe Ferreira 👋🏽 [Entre em contato!](https://www.linkedin.com/in/felipe-ferreira-755a951b8/)

---