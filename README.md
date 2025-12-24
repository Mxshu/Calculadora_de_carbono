# Calculadora de Carbono

Projeto de calculadora de emissões de CO2 para calcular o impacto ambiental de diferentes atividades e transportes.

## 📁 Estrutura do Projeto

```
Calculadora-carbono/
|-- index.html
|-- css/
|   |-- style.css
|-- js/
|   |-- routes-data.js
|   |-- config.js
|   |-- calculator.js
|   |-- ui.js
|   |-- app.js
|-- README.md
```

## 📋 Descrição dos Arquivos


### `index.html`
Arquivo principal HTML que estrutura a página da calculadora. Contém:
- Markup semântico da aplicação
- Links para o arquivo CSS (`css/style.css`)
- Scripts JavaScript linkados ou inline (`js/routes-data.js`, `js/config.js`, `js/calculator.js`, `js/ui.js`, `js/app.js`)

### `css/style.css`
Arquivo de estilos completo da aplicação. Inclui:
- Reset e estilos base
- Componentes visuais da calculadora
- Responsividade e layout
- Temas e animações

### `js/routes-data.js`
**Objeto Global de Dados de Rotas**
- Define dados estruturados de rotas (deslocamentos, trajetos)
- Armazena informações sobre diferentes tipos de transportes
- Fornece dados para cálculos de emissão por rota

### `js/config.js`
**Constantes de CO2**
- Fatores de emissão por tipo de transporte (kg CO2/km)
- Constantes de cálculo de carbono
- Configurações globais da aplicação

### `js/calculator.js`
**Lógica de Cálculo (Funções Globais)**
- Funções de cálculo de emissões de CO2
- Processamento de dados e conversões
- Operações matemáticas para determinação de impacto ambiental

### `js/ui.js`
**Manipulação de DOM (Funções Globais)**
- Funções para atualizar elementos HTML
- Gerenciamento de exibição de resultados
- Interações visuais e feedback do usuário

### `js/app.js`
**Inicialização e Eventos**
- Inicialização da aplicação
- Registro de event listeners
- Coordenação entre módulos
- Fluxo principal da aplicação

## 📝 Notas de Desenvolvimento

- Todos os scripts utilizam escopo global para funções e objetos
- A ordem de carregamento dos scripts é importante
- O DOM deve estar pronto antes da execução de `app.js`
- Estilos são carregados antes da renderização da página

## 📊 Objetivo do projeto

- O desenvolvimento de uma calculadora de carbono se originou de um desafio feito pela DIO no Bootcamp GitHub Copilot - Código na Prática.
