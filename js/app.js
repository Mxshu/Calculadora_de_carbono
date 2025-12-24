/**
 * app.js - Aplicação Principal da Calculadora de Emissão de CO2
 * 
 * DESCRIÇÃO GERAL:
 * Este arquivo contém a lógica de inicialização da aplicação e o manipulador
 * de eventos do formulário. Ele conecta todos os módulos (CONFIG, Calculator, UI)
 * para criar uma experiência funcional completa.
 * 
 * FLUXO:
 * 1. Quando DOM está pronto, inicializa a aplicação
 * 2. Popula datalist com cidades e configura auto-preenchimento de distância
 * 3. Aguarda submissão do formulário
 * 4. Realiza cálculos e renderiza resultados
 * 5. Mostra seções de resultados com animação e scroll
 */

/**
 * Event listener que aguarda o DOM estar completamente carregado
 * Executa toda a lógica de inicialização quando o documento está pronto
 */
document.addEventListener('DOMContentLoaded', function() {
  /**
   * ===========================
   * FASE 1: INICIALIZAÇÃO
   * ===========================
   */

  // Popula o datalist com lista de cidades do RoutesDB
  // Permite que o usuário tenha autocomplete ao digitar origem e destino
  CONFIG.populateDatalist();

  // Configura o auto-preenchimento de distância
  // Quando origem e destino são selecionados, busca a distância automaticamente
  CONFIG.setupDistanceAutofill();

  // Obter referência ao formulário pelo ID
  const calculatorForm = document.getElementById('calculator-form');

  // Validar se o formulário foi encontrado
  if (!calculatorForm) {
    console.error('Formulário com id "calculator-form" não encontrado');
    return;
  }

  // Log de sucesso na inicialização
  console.log('✓ Calculadora inicializada!');

  // Ajuste dinâmico do título para caber na largura do contêiner
  function fitTitle() {
    const el = document.querySelector('.calculator__title');
    if (!el || !el.parentElement) return;
    // Reset any previous transform
    el.style.transform = 'none';
    // Measure widths
    const containerWidth = el.parentElement.clientWidth - 16; // small padding allowance
    const titleWidth = el.scrollWidth;
    if (titleWidth > containerWidth) {
      const scale = containerWidth / titleWidth;
      el.style.transform = `scale(${scale})`;
    } else {
      el.style.transform = 'none';
    }
  }

  // Run immediately on load and on resize (no debounce) to avoid delay
  fitTitle();
  window.addEventListener('resize', fitTitle);
  window.addEventListener('orientationchange', fitTitle);
  // Also run after fonts load (if supported)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitTitle).catch(() => {});
  } else {
    // Fallback: run once after a short tick to ensure layout calculated
    setTimeout(fitTitle, 0);
  }

  // Use ResizeObserver when available to react instantly to container size changes
  if (typeof ResizeObserver !== 'undefined') {
    const headerEl = document.querySelector('.calculator__header');
    if (headerEl) {
      try {
        const ro = new ResizeObserver(() => {
          fitTitle();
        });
        ro.observe(headerEl);
      } catch (e) {
        // ignore if observing fails
      }
    }
  }

  /**
   * ===========================
   * FASE 2: MANIPULADOR DE SUBMISSÃO DO FORMULÁRIO
   * ===========================
   */

  /**
   * Event listener para submissão do formulário
   * Realiza todos os cálculos quando o usuário clica em "Calcular Emissão"
   */
  calculatorForm.addEventListener('submit', function(event) {
    // Prevenir o comportamento padrão de submissão do formulário
    // Evita recarregar a página
    event.preventDefault();

    /**
     * ETAPA 1: OBTER VALORES DO FORMULÁRIO
     */

    // Obter valor da origem (remover espaços em branco)
    const originValue = document.getElementById('origin').value.trim();

    // Obter valor do destino (remover espaços em branco)
    const destinationValue = document.getElementById('destination').value.trim();

    // Obter valor da distância (converter para número flutuante)
    const distanceValue = parseFloat(document.getElementById('distance').value);

    // Obter o radio button selecionado (modo de transporte)
    const selectedTransportRadio = document.querySelector('input[name="transport"]:checked');
    const transportMode = selectedTransportRadio ? selectedTransportRadio.value : null;

    /**
     * ETAPA 2: VALIDAR ENTRADAS
     */

    // Verificar se origem está preenchida
    if (!originValue) {
      alert('Por favor, selecione a cidade de origem');
      return;
    }

    // Verificar se destino está preenchida
    if (!destinationValue) {
      alert('Por favor, selecione a cidade de destino');
      return;
    }

    // Verificar se distância foi preenchida
    if (isNaN(distanceValue)) {
      alert('Por favor, insira a distância em quilômetros');
      return;
    }

    // Verificar se distância é maior que zero
    if (distanceValue <= 0) {
      alert('A distância deve ser maior que zero');
      return;
    }

    // Verificar se modo de transporte foi selecionado
    if (!transportMode) {
      alert('Por favor, selecione um modo de transporte');
      return;
    }

    /**
     * ETAPA 3: PREPARAR INTERFACE PARA CÁLCULO
     */

    // Obter botão de submit para controlar estado de carregamento
    const submitButton = calculatorForm.querySelector('button[type="submit"]');

    // Mostrar estado de carregamento no botão (spinner + "Calculando...")
    UI.showLoading(submitButton);

    // Ocultar seções de resultados anteriores
    UI.hideElement('results');
    UI.hideElement('comparison');
    UI.hideElement('carbon-credite');

    /**
     * ETAPA 4: SIMULAR PROCESSAMENTO COM DELAY
     * Usa setTimeout para simular tempo de processamento
     * Isso melhora a experiência do usuário mostrando o estado de carregamento
     */
    setTimeout(function() {
      try {
        /**
         * CÁLCULO 1: Emissão do modo selecionado
         */
        const selectedModeEmission = Calculator.calculateEmission(distanceValue, transportMode);

        /**
         * CÁLCULO 2: Emissão do carro como baseline para comparação
         */
        const carBaseline = Calculator.calculateEmission(distanceValue, 'car');

        /**
         * CÁLCULO 3: Calcular economia (se modo selecionado é diferente do carro)
         */
        const savingsData = Calculator.calculateSavings(selectedModeEmission, carBaseline);

        /**
         * CÁLCULO 4: Calcular emissão de todos os modos para comparação
         */
        const allModesComparison = Calculator.calculateAllModes(distanceValue);

        /**
         * CÁLCULO 5: Converter emissão do modo selecionado em créditos de carbono
         */
        const creditsNeeded = Calculator.calculateCarbonCredits(selectedModeEmission);

        /**
         * CÁLCULO 6: Estimar preço dos créditos de carbono
         */
        const priceEstimate = Calculator.estimateCreditPrice(creditsNeeded);

        /**
         * ETAPA 5: CONSTRUIR OBJETOS DE DADOS PARA RENDERIZAÇÃO
         */

        // Objeto com dados de resultados principais
        const resultsData = {
          origin: originValue,
          destination: destinationValue,
          distance: distanceValue,
          emission: selectedModeEmission,
          mode: transportMode,
          savings: transportMode !== 'car' ? savingsData : null
        };

        // Objeto com dados de créditos de carbono
        const creditsData = {
          credits: creditsNeeded,
          price: priceEstimate
        };

        /**
         * ETAPA 6: RENDERIZAR CONTEÚDO NAS SEÇÕES
         */

        // Renderizar resultados e inserir no container de resultados
        const resultsHTML = UI.renderResults(resultsData);
        document.getElementById('results-content').innerHTML = resultsHTML;

        // Renderizar comparação entre modos e inserir no container
        const comparisonHTML = UI.renderComparison(allModesComparison, transportMode);
        document.getElementById('comparison-content').innerHTML = comparisonHTML;

        // Renderizar créditos de carbono e inserir no container
        const creditsHTML = UI.renderCarbonCredits(creditsData);
        document.getElementById('carbon-credits-content').innerHTML = creditsHTML;

        /**
         * ETAPA 7: MOSTRAR SEÇÕES DE RESULTADOS
         */

        // Exibir seção de resultados
        UI.showElement('results');

        // Exibir seção de comparação
        UI.showElement('comparison');

        // Exibir seção de créditos de carbono
        UI.showElement('carbon-credite');

        /**
         * ETAPA 8: SCROLL PARA RESULTADOS
         */

        // Fazer scroll suave até a seção de resultados
        // Permite que o usuário veja os resultados imediatamente
        UI.scrollToElement('results');

        /**
         * ETAPA 9: RESTAURAR ESTADO DO BOTÃO
         */

        // Restaurar botão ao estado normal (remover loading)
        UI.hideLoading(submitButton);

        // Log de sucesso na console
        console.log('✓ Cálculo realizado com sucesso', resultsData);

      } catch (error) {
        /**
         * TRATAMENTO DE ERROS
         */

        // Logar erro detalhado na console para debugging
        console.error('Erro ao realizar cálculo:', error);

        // Mostrar mensagem amigável para o usuário
        alert('Ocorreu um erro ao realizar o cálculo. Por favor, tente novamente.');

        // Restaurar botão ao estado normal mesmo em caso de erro
        UI.hideLoading(submitButton);
      }

    }, 1500); // Delay de 1500ms para simular processamento
  });
});
