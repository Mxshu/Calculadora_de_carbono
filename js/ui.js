/**
 * ui.js - Manipulação da Interface de Usuário
 * 
 * DESCRIÇÃO GERAL:
 * Define um objeto global chamado UI que centraliza todos os métodos
 * para formatação de dados, manipulação de elementos DOM e renderização
 * de resultados da calculadora de emissões.
 * 
 * ESTRUTURA DO UI:
 * {
 *   // Métodos utilitários de formatação e manipulação de elementos
 *   formatNumber(): Function
 *   formatCurrency(): Function
 *   showElement(): Function
 *   hideElement(): Function
 *   scrollToElement(): Function
 *   
 *   // Métodos de renderização de conteúdo
 *   renderResults(): Function
 *   renderComparison(): Function
 *   renderCarbonCredits(): Function
 *   
 *   // Métodos de feedback do usuário
 *   showLoading(): Function
 *   hideLoading(): Function
 * }
 */

const UI = {
  /**
   * ===========================
   * MÉTODOS UTILITÁRIOS
   * ===========================
   */

  /**
   * formatNumber(number, decimals) - Formata número com separadores de milhar
   * 
   * LÓGICA:
   * 1. Usa toFixed() para definir número de casas decimais
   * 2. Utiliza toLocaleString('pt-BR') para adicionar separadores de milhar
   * 3. Retorna string formatada
   * 
   * EXEMPLO:
   * - formatNumber(1234.567, 2) => "1.234,57"
   * - formatNumber(10000, 0) => "10.000"
   * 
   * @param {number} number - Número a ser formatado
   * @param {number} decimals - Número de casas decimais desejadas
   * @returns {string} Número formatado com separadores pt-BR
   */
  formatNumber: function(number, decimals) {
    // Validar entrada
    if (typeof number !== 'number') {
      return '0';
    }

    // Usar toFixed para definir casas decimais
    const fixed = parseFloat(number).toFixed(decimals);

    // Usar toLocaleString para adicionar separadores de milhar (pt-BR)
    return parseFloat(fixed).toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * formatCurrency(value) - Formata valor como moeda brasileira
   * 
   * LÓGICA:
   * 1. Usa toLocaleString com estilo 'currency' e moeda 'BRL'
   * 2. Retorna string formatada como "R$ 1.234,56"
   * 
   * EXEMPLO:
   * - formatCurrency(100) => "R$ 100,00"
   * - formatCurrency(1234.5) => "R$ 1.234,50"
   * 
   * @param {number} value - Valor a ser formatado em reais
   * @returns {string} Valor formatado como moeda brasileira
   */
  formatCurrency: function(value) {
    // Validar entrada
    if (typeof value !== 'number') {
      return 'R$ 0,00';
    }

    // Formatar como moeda BRL usando locale pt-BR
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  /**
   * showElement(elementId) - Mostra um elemento removendo a classe 'hidden'
   * 
   * LÓGICA:
   * 1. Obtém elemento pelo ID
   * 2. Remove a classe 'hidden' que o oculta
   * 3. Elemento fica visível
   * 
   * @param {string} elementId - ID do elemento a ser mostrado
   */
  showElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
    } else {
      console.warn(`Elemento com id "${elementId}" não encontrado`);
    }
  },

  /**
   * hideElement(elementId) - Oculta um elemento adicionando a classe 'hidden'
   * 
   * LÓGICA:
   * 1. Obtém elemento pelo ID
   * 2. Adiciona a classe 'hidden' que o oculta
   * 3. Elemento deixa de ser visível
   * 
   * @param {string} elementId - ID do elemento a ser ocultado
   */
  hideElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    } else {
      console.warn(`Elemento com id "${elementId}" não encontrado`);
    }
  },

  /**
   * scrollToElement(elementId) - Faz scroll suave até um elemento
   * 
   * LÓGICA:
   * 1. Obtém elemento pelo ID
   * 2. Usa scrollIntoView com comportamento smooth
   * 3. Garante que o elemento fica visível na tela
   * 
   * @param {string} elementId - ID do elemento para o qual fazer scroll
   */
  scrollToElement: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Elemento com id "${elementId}" não encontrado`);
    }
  },

  /**
   * ===========================
   * MÉTODOS DE RENDERIZAÇÃO
   * ===========================
   */

  /**
   * renderResults(data) - Renderiza os resultados da calculadora
   * 
   * ESTRUTURA HTML GERADA:
   * - Container principal com classe "results__container"
   * - Cartões de informação (results__card):
   *   * Rota: origem -> destino
   *   * Distância: valor em km
   *   * Emissão: kg CO2 com ícone de folha
   *   * Modo de transporte: ícone e nome
   *   * Economia: (se não for carro e houver economia)
   * 
   * LÓGICA:
   * 1. Extrai metadata do modo de transporte de CONFIG
   * 2. Constrói string HTML com template literals
   * 3. Inclui cartão de economia se o modo não é 'car'
   * 4. Retorna HTML completo
   * 
   * @param {Object} data - Objeto com: {origin, destination, distance, emission, mode, savings}
   * @returns {string} String HTML com os resultados formatados
   */
  renderResults: function(data) {
    // Obter metadados do modo de transporte
    const modeData = CONFIG.TRANSPORT_MODES[data.mode];

    // Construir string HTML com resultado principal
    let html = `
      <div class="results__container">
        <h2 class="results__title">Resultado da Emissão</h2>
        
        <!-- Cartão de Rota -->
        <div class="results__card results__card--route">
          <div class="results__card-label">Rota</div>
          <div class="results__card-content">
            <span class="results__city">${data.origin}</span>
            <span class="results__arrow">→</span>
            <span class="results__city">${data.destination}</span>
          </div>
        </div>

        <!-- Cartão de Distância -->
        <div class="results__card results__card--distance">
          <div class="results__card-label">Distância</div>
          <div class="results__card-value">${this.formatNumber(data.distance, 2)} km</div>
        </div>

        <!-- Cartão de Emissão -->
        <div class="results__card results__card--emission">
          <div class="results__card-label">Emissão de CO<sub>2</sub></div>
          <div class="results__card-value">
            🍃 ${this.formatNumber(data.emission, 2)} kg
          </div>
        </div>

        <!-- Cartão de Modo de Transporte -->
        <div class="results__card results__card--mode">
          <div class="results__card-label">Modo de Transporte</div>
          <div class="results__card-content">
            <span class="results__mode-icon">${modeData.emoji}</span>
            <span class="results__mode-label">${modeData.label}</span>
          </div>
        </div>
    `;

    // Adicionar cartão de economia se não for carro e houver economia
    if (data.mode !== 'car' && data.savings) {
      html += `
        <!-- Cartão de Economia -->
        <div class="results__card results__card--savings">
          <div class="results__card-label">Economia vs Carro</div>
          <div class="results__card-content">
            <div class="results__savings-item">
              <span class="results__savings-label">Kg Economizados:</span>
              <span class="results__savings-value">${this.formatNumber(data.savings.savedKg, 2)} kg</span>
            </div>
            <div class="results__savings-item">
              <span class="results__savings-label">Percentual:</span>
              <span class="results__savings-value">${this.formatNumber(data.savings.percentage, 2)}%</span>
            </div>
          </div>
        </div>
      `;
    }

    html += `
      </div>
    `;

    return html;
  },

  /**
   * renderComparison(modesArray, selectedMode) - Renderiza comparação entre modos
   * 
   * ESTRUTURA HTML GERADA:
   * - Container de comparação (comparison__container)
   * - Para cada modo:
   *   * Item com classe "comparison__item" (ou "comparison__item--selected")
   *   * Header com ícone, nome e emissão
   *   * Badge "Selecionado" se é o modo escolhido
   *   * Stats com emissão e percentual vs carro
   *   * Progress bar colorida baseada na emissão
   * - Box de dica com mensagem educativa no final
   * 
   * CORES DA PROGRESS BAR:
   * - Verde (0-25%): baixa emissão
   * - Amarelo (25-75%): emissão média
   * - Laranja (75-100%): emissão alta
   * - Vermelho (>100%): emissão muito alta
   * 
   * LÓGICA:
   * 1. Cria container principal
   * 2. Para cada modo no array, renderiza item com stats
   * 3. Determina cor da progress bar baseado no percentual
   * 4. Adiciona badge se é o modo selecionado
   * 5. Inclui progress bar com largura proporcional
   * 6. Adiciona box de dica no final
   * 
   * @param {Array} modesArray - Array de objetos {mode, emission, percentageVsCar}
   * @param {string} selectedMode - Nome do modo selecionado
   * @returns {string} String HTML com comparação entre modos
   */
  renderComparison: function(modesArray, selectedMode) {
    // Encontrar emissão máxima para usar como referência (100%)
    const maxEmission = Math.max(...modesArray.map(m => m.emission));

    // Iniciar HTML do container
    let html = `
      <div class="comparison__container">
        <h2 class="comparison__title">Comparação entre Modos de Transporte</h2>
    `;

    // Iterar sobre cada modo de transporte
    modesArray.forEach(item => {
      // Obter metadados do modo
      const modeData = CONFIG.TRANSPORT_MODES[item.mode];

      // Verificar se este é o modo selecionado
      const isSelected = item.mode === selectedMode;
      const selectedClass = isSelected ? ' comparison__item--selected' : '';

      // Calcular percentual para progress bar (0-100)
      const progressPercent = (item.emission / maxEmission) * 100;

      // Determinar cor da progress bar baseado no percentual vs carro
      let barColor = '#10b981';  // Verde padrão
      if (item.percentageVsCar > 100) {
        barColor = '#ef4444';    // Vermelho (>100%)
      } else if (item.percentageVsCar > 75) {
        barColor = '#f59e0b';    // Laranja (75-100%)
      } else if (item.percentageVsCar > 25) {
        barColor = '#fbbf24';    // Amarelo (25-75%)
      }

      // Construir HTML do item de comparação
      html += `
        <div class="comparison__item${selectedClass}">
          <!-- Header com ícone, nome e stats -->
          <div class="comparison__header">
            <div class="comparison__mode-info">
              <span class="comparison__icon">${modeData.emoji}</span>
              <span class="comparison__label">${modeData.label}</span>
              ${isSelected ? '<span class="comparison__badge">Selecionado</span>' : ''}
            </div>
            <div class="comparison__emission-stats">
              <span class="comparison__emission">${this.formatNumber(item.emission, 2)} kg</span>
              <span class="comparison__percentage">${this.formatNumber(item.percentageVsCar, 1)}% do carro</span>
            </div>
          </div>

          <!-- Progress bar com cores baseadas na emissão -->
          <div class="comparison__progress-container">
            <div class="comparison__progress-bar" style="width: ${progressPercent}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    });

    // Adicionar box de dica
    html += `
        <div class="comparison__tip">
          <strong>💡 Dica:</strong> Escolha um modo de transporte com menor emissão de CO<sub>2</sub> 
          para reduzir seu impacto ambiental. A bicicleta é a opção mais sustentável!
        </div>
      </div>
    `;

    return html;
  },

  /**
   * renderCarbonCredits(creditsData) - Renderiza informações de créditos de carbono
   * 
   * ESTRUTURA HTML GERADA:
   * - Container principal (carbon_credits__container)
   * - Grid com 2 cartões:
   *   * Cartão 1: Quantidade de créditos necessários
   *   * Cartão 2: Preço estimado (médio com range min-max)
   * - Box informativo sobre o que é crédito de carbono
   * - Botão de ação para compensação (não-funcional para demo)
   * 
   * LÓGICA:
   * 1. Extrai dados de créditos e preço do objeto
   * 2. Constrói grid com 2 cartões lado a lado
   * 3. Formata números e valores monetários
   * 4. Inclui box explicativo sobre créditos de carbono
   * 5. Adiciona botão de compensação como elemento visual
   * 
   * @param {Object} creditsData - Objeto com: {credits, price: {min, max, average}}
   * @returns {string} String HTML com informações de créditos de carbono
   */
  renderCarbonCredits: function(creditsData) {
    const html = `
      <div class="carbon-credits__container">
        <h2 class="carbon-credits__title">Créditos de Carbono</h2>

        <!-- Grid com 2 cartões -->
        <div class="carbon-credits__grid">
          <!-- Cartão 1: Créditos Necessários -->
          <div class="carbon-credits__card">
            <div class="carbon-credits__card-label">Créditos Necessários</div>
            <div class="carbon-credits__card-value">
              ${this.formatNumber(creditsData.credits, 4)}
            </div>
            <div class="carbon-credits__card-helper">
              1 crédito = 1.000 kg CO<sub>2</sub>
            </div>
          </div>

          <!-- Cartão 2: Preço Estimado -->
          <div class="carbon-credits__card">
            <div class="carbon-credits__card-label">Preço Estimado</div>
            <div class="carbon-credits__card-value">
              ${this.formatCurrency(creditsData.price.average)}
            </div>
            <div class="carbon-credits__card-range">
              ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}
            </div>
          </div>
        </div>

        <!-- Box Informativo sobre Créditos de Carbono -->
        <div class="carbon-credits__info-box">
          <h3 class="carbon-credits__info-title">O que é um Crédito de Carbono?</h3>
          <p class="carbon-credits__info-text">
            Um crédito de carbono representa o direito de emitir uma tonelada de dióxido de carbono 
            equivalente. Ao comprar créditos, você financia projetos de redução de emissões e 
            neutraliza o impacto ambiental de sua viagem.
          </p>
          <p class="carbon-credits__info-text">
            Exemplos de projetos: reflorestamento, energia renovável, eficiência energética.
          </p>
        </div>

        <!-- Botão de Ação (Demo) -->
        <button class="carbon-credits__button">
          🛒 Compensar Emissões
        </button>
      </div>
    `;

    return html;
  },

  /**
   * showLoading(buttonElement) - Mostra estado de carregamento no botão
   * 
   * LÓGICA:
   * 1. Salva texto original em dataset.originalText
   * 2. Desabilita o botão
   * 3. Altera conteúdo para mostrar spinner e "Calculando..."
   * 4. Bloqueia cliques enquanto carrega
   * 
   * @param {HTMLElement} buttonElement - Elemento button a ser modificado
   */
  showLoading: function(buttonElement) {
    if (!buttonElement) {
      console.warn('Button element não foi fornecido para showLoading');
      return;
    }

    // Salvar texto original para restaurar depois
    buttonElement.dataset.originalText = buttonElement.innerHTML;

    // Desabilitar botão
    buttonElement.disabled = true;

    // Mostrar spinner e texto de carregamento
    buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
  },

  /**
   * hideLoading(buttonElement) - Remove estado de carregamento do botão
   * 
   * LÓGICA:
   * 1. Habilita o botão
   * 2. Restaura texto original do dataset.originalText
   * 3. Botão volta a ser clicável
   * 
   * @param {HTMLElement} buttonElement - Elemento button a ser restaurado
   */
  hideLoading: function(buttonElement) {
    if (!buttonElement) {
      console.warn('Button element não foi fornecido para hideLoading');
      return;
    }

    // Habilitar botão
    buttonElement.disabled = false;

    // Restaurar texto original
    if (buttonElement.dataset.originalText) {
      buttonElement.innerHTML = buttonElement.dataset.originalText;
    }
  }
};
