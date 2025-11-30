# Cognos - Projeto PCS3643

## Integrantes do Grupo

-   Bernardo Asztalos Teixeira
-   Beatriz Barreto Tavora
-   Hugo Spadete Arrivabene
-   Caique Granja Maia

## Descrição do Projeto

Este repositório contém o frontend do projeto Cognos.\
Aqui está implementada a interface da aplicação, com as telas de
navegação para os diferentes tipos de usuário (paciente e terapeuta).

## Execução do Projeto

Backend e frontend devem rodar simultaneamente:

-   **Backend:** porta 8000\
-   **Frontend:** porta 8081

Caso o backend não esteja rodando na porta correta (8000), é possível
alterar a URL no arquivo `src/services/api.ts`.

## Como Rodar Localmente

Instale as dependências:

    npm install

Execute:

    npx expo start

## Fluxo de Execução

------------------------------------------------------------------------

# Fluxo de Telas do Paciente

## Autenticação

No topo da página, clique no botão cadastro para ir para página de Cadastro.

### Página de Cadastro

Preencha todos os campos solicitados para o cadastro do usuário.\
Ao selecionar o tipo de usuário (paciente ou terapeuta), surgirão campos
específicos. Complete os campos relacionados ao paciente e clique no
botão **Cadastrar**.

## Home

No campo **Conectar terapeuta**, digite o nome de um terapeuta
(recomenda-se digitar "terapeuta"), selecione-o e clique em **Enviar
solicitação** para solicitar a conexão.

## Jogos

Na aba lateral, selecione **Jogos** e navegue para a página de seleção.

Escolha um dos jogos:
- Encontre a Bola
- Jogo da Reação
- Jogo da Memória
- Wisconsin Card Game

Leia as instruções correspondentes e clique em **Iniciar**.\
Jogue até a tela de conclusão da partida.

**Atenção:** o jogo *Cognos Math* foi implementado para outra disciplina
e não pode ser testado.

Na parte inferior da aba lateral, selecione **Sair** para voltar à
página de Login.

------------------------------------------------------------------------

# Fluxo de Telas do Terapeuta

### Página de Cadastro

Preencha os campos solicitados. Ao selecionar o tipo terapeuta, surgirão
campos específicos. Complete-os e clique em **Cadastrar**.

## Home

No campo **Conectar paciente**, escreva o nome do paciente criado e
envie a solicitação de conexão.

## Wiki

Na aba lateral, selecione **Wiki** para acessar os conceitos publicados
pelos terapeutas.

Na aba lateral, selecione **Post Wiki** e crie um novo post: escolha um
tópico, escreva um conceito e uma descrição, e clique em **Adicionar**.

**Observação:** Como você não é admin, seu post não ficará disponível na
Wiki. É necessário que um admin faça login e aceite o post.

Na parte inferior da aba lateral, selecione **Sair** para voltar ao
Login.

------------------------------------------------------------------------

# Fluxo de Telas do Terapeuta Admin

### Página de Login

Use as credenciais:\
**Email:** terapeuta@usp.br\
**Senha:** 12345678

## Wiki

Na aba lateral, selecione **Wiki**. Um novo campo, **Posts Pendentes**,
estará disponível.\
Nele estará o conceito criado anteriormente. Você pode aceitar (botão
verde) ou negar (botão vermelho).\
Se aceitar, o post será inserido em seu tópico correspondente; se negar,
nada será alterado.

## Dashboard

Na aba lateral, selecione **Dashboard** para visualizar gráficos de
performance dos pacientes.

No dropdown **Paciente**, selecione o paciente desejado (recomenda-se
*Paciente da Silva*, com dados mockados).

No dropdown **Jogo**, selecione o jogo desejado.\
Cada jogo possui métricas diferentes; em cada gráfico é possível
visualizar média e desvio padrão das partidas.\
É possível também **agregar por sessão**, agrupando dados de partidas do
mesmo dia e exibindo novas métricas agregadas.

**Observação:** Todo terapeuta tem acesso à Wiki de seus pacientes, mas
recomendamos visualizar pelo usuário *terapeuta@usp.br*, que já possui
dados mockados.

------------------------------------------------------------------------

# Fim do Fluxo de Execução
