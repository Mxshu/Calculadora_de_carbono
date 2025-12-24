/**
 * config.js - Configuração da Calculadora de Emissão de CO2
 * 
 * DESCRIÇÃO GERAL:
 * Define um objeto global chamado CONFIG que centraliza todas as configurações,
 * constantes e métodos de inicialização da aplicação da calculadora de emissões.
 * 
 * ESTRUTURA DO CONFIG:
 * {
 *   EMISSION_FACTORS: Object      - Fatores de emissão por modo de transporte
 *   TRANSPORT_MODES: Object       - Metadados dos modos de transporte
 *   CARBON_CREDIT: Object         - Configurações de crédito de carbono
 *   populateDatalist(): Function  - Popula a lista de cidades no datalist
 *   setupDistanceAutofill(): Function - Configura auto-preenchimento de distância
 * }
 */

const CONFIG = {
  /**
   * FATORES DE EMISSÃO DE CO2
   * 
   * Contém o valor de emissão de CO2 em quilogramas por quilômetro
   * para cada modo de transporte. Estes valores são usados para calcular
   * as emissões totais da viagem.
   * 
   * Fonte: Estimativas baseadas em dados de transporte sustentável
   */
  EMISSION_FACTORS: {
    bicycle: 0,        // Bicicleta: zero emissão (transporte limpo)
    car: 0.12,         // Carro: 0.12 kg CO2/km (aproximadamente)
    plane: 0.20,       // Avião: 0.20 kg CO2/km (estimativa por passageiro)
    boat: 0.15,        // Barco: 0.15 kg CO2/km (estimativa média por passageiro)
    bus: 0.089,        // Ônibus: 0.089 kg CO2/km (mais eficiente)
    truck: 0.96        // Caminhão: 0.96 kg CO2/km (maior emissão)
  },

  /**
   * METADADOS DOS MODOS DE TRANSPORTE
   * 
   * Contém informações de exibição para cada modo de transporte incluindo:
   * - label: Nome em português brasileiro
   * - emoji: Ícone emoji representativo
   * - color: Cor hexadecimal para uso na interface
   */
  TRANSPORT_MODES: {
    bicycle: {
      label: 'Bicicleta',
      emoji: '🚲',
      color: '#3b82f6'  // Azul
    },
    car: {
      label: 'Carro',
      emoji: '🚗',
      color: '#ef4444'  // Vermelho
    },
    bus: {
      label: 'Ônibus',
      emoji: '🚌',
      color: '#f59e0b'  // Âmbar
    },
    truck: {
      label: 'Caminhão',
      emoji: '🚚',
      color: '#8b5cf6'  // Roxo
    }
    ,
    plane: {
      label: 'Avião',
      emoji: '✈️',
      color: '#0284c7' // Azul-céu
    }
    ,
    boat: {
      label: 'Barco',
      emoji: '🚢',
      color: '#0ea5a4' // Verde-água
    }
  },

  /**
   * CONFIGURAÇÕES DE CRÉDITO DE CARBONO
   * 
   * Define parâmetros para conversão de emissões em créditos de carbono
   * e valores de precificação em reais brasileiros.
   */
  CARBON_CREDIT: {
    KG_PER_CREDIT: 1000,      // 1 crédito de carbono = 1000 kg de CO2
    PRICE_MIN_BRL: 50,        // Preço mínimo em reais por crédito
    PRICE_MAX_BRL: 150        // Preço máximo em reais por crédito
  },

  /**
   * populateDatalist() - Popula o elemento datalist com as cidades disponíveis
   * 
   * FUNCIONAMENTO:
   * 1. Obtém a lista de todas as cidades únicas do RoutesDB
   * 2. Localiza o elemento datalist no HTML pela id 'cities-list'
   * 3. Cria elementos <option> para cada cidade
   * 4. Adiciona cada opção ao datalist para autocomplete
   * 
   * RESULTADO:
   * O usuário verá sugestões de cidades ao digitar na origem/destino
   */
  populateDatalist: function() {
    // Obter lista de cidades a partir do RoutesDB
    const cities = RoutesDB.getAllCities();

    // Obter elemento datalist do HTML
    const datalist = document.getElementById('cities-list');

    // Verificar se o datalist existe antes de processar
    if (!datalist) {
      console.warn('Elemento datalist com id "cities-list" não encontrado');
      return;
    }

    // Limpar datalist anterior (se houver)
    datalist.innerHTML = '';

    // Criar e adicionar elemento <option> para cada cidade
    cities.forEach(city => {
      // Criar novo elemento option
      const option = document.createElement('option');
      // Definir o valor e texto da opção como o nome da cidade
      option.value = city;
      // Adicionar a opção ao datalist
      datalist.appendChild(option);
    });

    console.log(`Datalist populado com ${cities.length} cidades`);
  },

  /**
   * setupDistanceAutofill() - Configura o auto-preenchimento de distância entre cidades
   * 
   * FUNCIONAMENTO:
   * 1. Obtém referências aos elementos de entrada de origem e destino
   * 2. Obtém referência ao input de distância e checkbox de entrada manual
   * 3. Adiciona listeners de evento 'change' aos inputs de origem e destino
   * 4. Adiciona listener de evento 'change' ao checkbox de entrada manual
   * 
   * LÓGICA DE MUDANÇA (origin/destination):
   * - Obtém valores trimmed de ambos os inputs
   * - Se ambos estão preenchidos:
   *   * Busca a distância no RoutesDB usando findDistance()
   *   * Se encontrada:
   *     - Preenche o input de distância com o valor
   *     - Define o input como readonly
   *     - Muda a cor do texto auxiliar para verde (sucesso)
   *   * Se não encontrada:
   *     - Limpa o input de distância
   *     - Muda o texto auxiliar sugerindo entrada manual
   *     - Muda a cor para aviso
   * - Se qualquer input está vazio:
   *   - Limpa o input de distância
   *   - Restaura texto e cor padrão do helper
   * 
   * LÓGICA DO CHECKBOX (manual-distance):
   * - Se marcado:
   *   * Remove atributo readonly do input de distância
   *   * Permite que o usuário edite manualmente
   *   * Auto-foca no input de distância
   * - Se desmarcado:
   *   * Tenta buscar rota novamente
   *   * Se encontrar, restaura valor automático
   *   * Se não encontrar, deixa vazio
   *   * Restaura readonly
   */
  setupDistanceAutofill: function() {
    // Obter elementos de entrada de origem e destino
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');

    // Obter elemento de entrada de distância e checkbox
    const distanceInput = document.getElementById('distance');
    const manualCheckbox = document.getElementById('manual-distance');

    // Obter elemento de texto auxiliar para mensagens
    const helperText = distanceInput.parentElement.querySelector('.calculator__help');

    // Verificar se todos os elementos necessários existem
    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
      console.warn('Um ou mais elementos necessários não foram encontrados para setupDistanceAutofill');
      return;
    }

    // Função auxiliar para tentar buscar e preencher a distância
    function attemptFillDistance() {
      // Obter valores trimmed de origem e destino
      const origin = originInput.value.trim();
      const destination = destinationInput.value.trim();

      // Verificar se ambos os inputs estão preenchidos
      if (origin && destination) {
        // Buscar distância no RoutesDB
        const distance = RoutesDB.findDistance(origin, destination);

        if (distance !== null) {
          // Rota encontrada: preencher distância e definir como readonly
          distanceInput.value = distance;
          distanceInput.setAttribute('readonly', '');
          manualCheckbox.checked = false;

          // Atualizar texto auxiliar com mensagem de sucesso em verde
          helperText.textContent = '✓ Distância preenchida automaticamente';
          helperText.style.color = '#10b981';  // Cor verde (sucesso)
        } else {
          // Rota não encontrada: sugerir entrada manual
          distanceInput.value = '';
          helperText.textContent = 'Rota não encontrada. Insira a distância manualmente marcando a caixa abaixo.';
          helperText.style.color = '#f59e0b';  // Cor âmbar (aviso)
        }
      } else {
        // Origem ou destino vazio: limpar distância e restaurar estado padrão
        distanceInput.value = '';
        distanceInput.setAttribute('readonly', '');
        manualCheckbox.checked = false;

        // Restaurar texto e cor padrão do helper
        helperText.textContent = 'A distância será preenchida automaticamente';
        helperText.style.color = '#6b7280';  // Cor cinza padrão
      }
    }

    // Adicionar listeners de 'change' aos inputs de origem e destino
    originInput.addEventListener('change', attemptFillDistance);
    destinationInput.addEventListener('change', attemptFillDistance);

    // Adicionar listener ao checkbox de entrada manual
    manualCheckbox.addEventListener('change', function() {
      if (this.checked) {
        // Checkbox marcado: desbloquear input de distância para edição manual
        distanceInput.removeAttribute('readonly');
        distanceInput.focus();
        helperText.textContent = 'Você está editando a distância manualmente';
        helperText.style.color = '#3b82f6';  // Cor azul (info)
      } else {
        // Checkbox desmarcado: tentar buscar rota novamente
        attemptFillDistance();
      }
    });

    console.log('Auto-preenchimento de distância configurado com sucesso');
  }
};
