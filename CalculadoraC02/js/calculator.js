/**
 * calculator.js - Lógica de Cálculo da Calculadora de Emissão de CO2
 * 
 * DESCRIÇÃO GERAL:
 * Define um objeto global chamado Calculator que centraliza todos os cálculos
 * relacionados a emissões de CO2, créditos de carbono e comparações entre
 * diferentes modos de transporte.
 * 
 * ESTRUTURA DO CALCULATOR:
 * {
 *   calculateEmission(): Function         - Calcula emissão para um modo
 *   calculateAllModes(): Function         - Calcula emissão para todos os modos
 *   calculateSavings(): Function          - Calcula economia vs baseline
 *   calculateCarbonCredits(): Function    - Converte kg em créditos de carbono
 *   estimateCreditPrice(): Function       - Estima preço dos créditos
 * }
 * 
 * FLUXO TÍPICO DE USO:
 * 1. Usuário seleciona origem, destino e modo de transporte
 * 2. calculateEmission() calcula emissão do modo selecionado
 * 3. calculateAllModes() mostra comparação com outros modos
 * 4. calculateCarbonCredits() converte emissão em créditos
 * 5. estimateCreditPrice() mostra quanto custaria neutralizar
 */

const Calculator = {
  /**
   * calculateEmission(distanceKm, transportMode) - Calcula emissão de CO2
   * 
   * LÓGICA:
   * 1. Obtém o fator de emissão do CONFIG baseado no modo de transporte
   * 2. Multiplica a distância pelo fator de emissão
   * 3. Arredonda o resultado para 2 casas decimais
   * 
   * EXEMPLO:
   * - Distância: 100 km
   * - Modo: 'car' (fator: 0.12)
   * - Cálculo: 100 * 0.12 = 12 kg CO2
   * 
   * @param {number} distanceKm - Distância da viagem em quilômetros
   * @param {string} transportMode - Modo de transporte ('bicycle', 'car', 'bus', 'truck')
   * @returns {number} Emissão de CO2 em quilogramas, arredondado a 2 decimais
   */
  calculateEmission: function(distanceKm, transportMode) {
    // Validar entrada
    if (distanceKm < 0 || !transportMode) {
      console.warn('Entrada inválida para calculateEmission');
      return 0;
    }

    // Obter fator de emissão do CONFIG para o modo selecionado
    const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];

    // Validar se o modo de transporte existe nas configurações
    if (emissionFactor === undefined) {
      console.warn(`Modo de transporte "${transportMode}" não encontrado em CONFIG.EMISSION_FACTORS`);
      return 0;
    }

    // Calcular emissão: distância * fator
    const emission = distanceKm * emissionFactor;

    // Arredondar para 2 casas decimais
    return Math.round(emission * 100) / 100;
  },

  /**
   * calculateAllModes(distanceKm) - Calcula emissão para todos os modos de transporte
   * 
   * LÓGICA:
   * 1. Cria array para armazenar resultados
   * 2. Itera sobre cada modo em CONFIG.EMISSION_FACTORS
   * 3. Para cada modo:
   *    - Calcula a emissão usando calculateEmission()
   *    - Calcula a emissão do carro como baseline
   *    - Calcula percentual comparado ao carro: (emissão / emissão_carro) * 100
   *    - Adiciona objeto com modo, emissão e percentual ao array
   * 4. Ordena array por emissão (menor primeiro)
   * 5. Retorna array ordenado
   * 
   * EXEMPLO (distância: 100 km):
   * - Bicicleta: 0 kg (0% do carro)
   * - Ônibus: 8.9 kg (74% do carro)
   * - Carro: 12 kg (100% - baseline)
   * - Caminhão: 96 kg (800% do carro)
   * 
   * @param {number} distanceKm - Distância da viagem em quilômetros
   * @returns {Array<Object>} Array de objetos com: {mode, emission, percentageVsCar}
   */
  calculateAllModes: function(distanceKm) {
    // Array para armazenar resultados de todos os modos
    const results = [];

    // Calcular emissão do carro como baseline para comparação
    const carEmission = this.calculateEmission(distanceKm, 'car');

    // Evitar divisão por zero se a distância for 0
    if (carEmission === 0) {
      // Se não há emissão do carro (distância 0), retornar array vazio
      return results;
    }

    // Iterar sobre cada modo de transporte disponível em CONFIG
    Object.keys(CONFIG.EMISSION_FACTORS).forEach(mode => {
      // Calcular emissão para este modo de transporte
      const emission = this.calculateEmission(distanceKm, mode);

      // Calcular percentual em relação ao carro (baseline = 100%)
      const percentageVsCar = (emission / carEmission) * 100;

      // Criar objeto com os resultados
      const result = {
        mode: mode,                           // Nome do modo ('bicycle', 'car', 'bus', 'truck')
        emission: emission,                   // Emissão em kg CO2
        percentageVsCar: Math.round(percentageVsCar * 100) / 100  // Percentual vs carro, 2 decimais
      };

      // Adicionar resultado ao array
      results.push(result);
    });

    // Ordenar array por emissão (menor primeiro) para melhor visualização
    results.sort((a, b) => a.emission - b.emission);

    return results;
  },

  /**
   * calculateSavings(emission, baselineEmission) - Calcula economia de emissão
   * 
   * LÓGICA:
   * 1. Calcula quantidade economizada: baseline - emission
   * 2. Calcula percentual economizado: (economizado / baseline) * 100
   * 3. Arredonda ambos para 2 casas decimais
   * 4. Retorna objeto com valores
   * 
   * EXEMPLO:
   * - Emissão do ônibus: 8.9 kg
   * - Emissão baseline (carro): 12 kg
   * - Economizado: 3.1 kg
   * - Percentual: 25.83%
   * 
   * @param {number} emission - Emissão de CO2 em kg (modo escolhido)
   * @param {number} baselineEmission - Emissão baseline em kg (geralmente do carro)
   * @returns {Object} Objeto com {savedKg, percentage} arredondados a 2 decimais
   */
  calculateSavings: function(emission, baselineEmission) {
    // Validar entradas
    if (baselineEmission === 0) {
      console.warn('Emissão baseline não pode ser zero');
      return { savedKg: 0, percentage: 0 };
    }

    // Calcular quantidade de kg economizada
    const savedKg = Math.round((baselineEmission - emission) * 100) / 100;

    // Calcular percentual economizado em relação ao baseline
    const percentage = Math.round((savedKg / baselineEmission) * 10000) / 100;

    // Retornar objeto com os resultados
    return {
      savedKg: savedKg,          // Quilogramas economizados
      percentage: percentage      // Percentual economizado
    };
  },

  /**
   * calculateCarbonCredits(emissionKg) - Converte emissão em créditos de carbono
   * 
   * LÓGICA:
   * 1. Divide a emissão em kg pelo valor de kg por crédito (CONFIG.CARBON_CREDIT.KG_PER_CREDIT)
   * 2. Arredonda o resultado para 4 casas decimais
   * 3. Retorna o número de créditos
   * 
   * EXEMPLO:
   * - Emissão: 1250 kg CO2
   * - Configuração: 1000 kg por crédito
   * - Cálculo: 1250 / 1000 = 1.25 créditos
   * 
   * NOTA:
   * Um crédito de carbono representa o direito de emitir 1 tonelada de CO2 equivalente.
   * Este valor é usado para cálculos de neutralização de carbono.
   * 
   * @param {number} emissionKg - Emissão de CO2 em quilogramas
   * @returns {number} Número de créditos de carbono, arredondado a 4 decimais
   */
  calculateCarbonCredits: function(emissionKg) {
    // Validar entrada
    if (emissionKg < 0) {
      console.warn('Emissão não pode ser negativa');
      return 0;
    }

    // Calcular créditos: dividir emissão pelo kg por crédito
    const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

    // Arredondar para 4 casas decimais para maior precisão
    return Math.round(credits * 10000) / 10000;
  },

  /**
   * estimateCreditPrice(credits) - Estima preço dos créditos de carbono
   * 
   * LÓGICA:
   * 1. Calcula preço mínimo: créditos * PRICE_MIN_BRL
   * 2. Calcula preço máximo: créditos * PRICE_MAX_BRL
   * 3. Calcula preço médio: (mínimo + máximo) / 2
   * 4. Arredonda todos para 2 casas decimais
   * 5. Retorna objeto com os três valores
   * 
   * EXEMPLO:
   * - Créditos: 1.25
   * - Preço mín: R$50/crédito => 1.25 * 50 = R$62.50
   * - Preço máx: R$150/crédito => 1.25 * 150 = R$187.50
   * - Preço médio: (62.50 + 187.50) / 2 = R$125.00
   * 
   * NOTA:
   * Os preços refletem a variação de mercado de créditos de carbono.
   * O usuário pode usar essa faixa para entender quanto custaria
   * neutralizar suas emissões no mercado voluntário.
   * 
   * @param {number} credits - Número de créditos de carbono
   * @returns {Object} Objeto com {min, max, average} em reais, arredondados a 2 decimais
   */
  estimateCreditPrice: function(credits) {
    // Validar entrada
    if (credits < 0) {
      console.warn('Número de créditos não pode ser negativo');
      return { min: 0, max: 0, average: 0 };
    }

    // Calcular preço mínimo usando PRICE_MIN_BRL
    const minPrice = Math.round(credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL * 100) / 100;

    // Calcular preço máximo usando PRICE_MAX_BRL
    const maxPrice = Math.round(credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL * 100) / 100;

    // Calcular preço médio entre mínimo e máximo
    const averagePrice = Math.round((minPrice + maxPrice) / 2 * 100) / 100;

    // Retornar objeto com os três valores em reais
    return {
      min: minPrice,        // Preço mínimo em reais
      max: maxPrice,        // Preço máximo em reais
      average: averagePrice // Preço médio em reais
    };
  }
};
