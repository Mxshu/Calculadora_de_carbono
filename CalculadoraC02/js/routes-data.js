/**
 * routes-data.js - Banco de dados de rotas brasileiras
 * 
 * DESCRIÇÃO GERAL:
 * Define um objeto global chamado RoutesDB que funciona como banco de dados
 * de rotas brasileiras, contendo informações sobre distâncias entre cidades
 * e métodos para consultar essas informações.
 * 
 * ESTRUTURA DO RoutesDB:
 * {
 *   routes: Array<Object>         - Array com todas as rotas cadastradas
 *   getAllCities(): Function      - Retorna lista de cidades únicas e ordenadas
 *   findDistance(): Function      - Busca distância entre duas cidades
 * }
 * 
 * ESTRUTURA DE CADA ROTA:
 * {
 *   origin: string,              - Cidade de origem (ex: "São Paulo, SP")
 *   destination: string,         - Cidade de destino (ex: "Rio de Janeiro, RJ")
 *   distanceKm: number          - Distância em quilômetros
 * }
 * 
 * REGIÕES COBERTAS:
 * - Sudeste: São Paulo, Rio de Janeiro, Belo Horizonte, Campinas, etc.
 * - Norte: Manaus, Belém, Rio Branco
 * - Nordeste: Salvador, Recife, Fortaleza, Natal, Maceió, São Luís, Teresina
 * - Sul: Curitiba, Porto Alegre, Florianópolis, Londrina, Santa Maria
 * - Centro-Oeste: Brasília, Goiânia, Cuiabá, Campo Grande
 * 
 * USO:
 * - Acessar todas as cidades: RoutesDB.getAllCities()
 * - Buscar distância: RoutesDB.findDistance("São Paulo, SP", "Rio de Janeiro, RJ")
 */

const RoutesDB = {
  /**
   * Array contendo objetos de rota com origem, destino e distância em km
   * Inclui conexões de capital a capital, rotas regionais e principais centros urbanos
   */
  routes: [
    // Rotas Sudeste
    { origin: 'São Paulo, SP', destination: 'Rio de Janeiro, RJ', distanceKm: 430 },
    { origin: 'São Paulo, SP', destination: 'Brasília, DF', distanceKm: 1015 },
    { origin: 'Rio de Janeiro, RJ', destination: 'Brasília, DF', distanceKm: 1148 },
    { origin: 'São Paulo, SP', destination: 'Campinas, SP', distanceKm: 95 },
    { origin: 'Rio de Janeiro, RJ', destination: 'Niterói, RJ', distanceKm: 13 },
    { origin: 'Belo Horizonte, MG', destination: 'Ouro Preto, MG', distanceKm: 100 },
    { origin: 'São Paulo, SP', destination: 'Belo Horizonte, MG', distanceKm: 586 },
    { origin: 'Rio de Janeiro, RJ', destination: 'Belo Horizonte, MG', distanceKm: 716 },
    { origin: 'São Paulo, SP', destination: 'Sorocaba, SP', distanceKm: 108 },
    { origin: 'São Paulo, SP', destination: 'Guarulhos, SP', distanceKm: 28 },

    // Rotas Norte
    { origin: 'Manaus, AM', destination: 'Rio Branco, AC', distanceKm: 1800 },
    { origin: 'Belém, PA', destination: 'Manaus, AM', distanceKm: 1665 },
    { origin: 'Belém, PA', destination: 'Brasília, DF', distanceKm: 1863 },
    { origin: 'Manaus, AM', destination: 'Brasília, DF', distanceKm: 2187 },

    // Rotas Nordeste
    { origin: 'Salvador, BA', destination: 'Brasília, DF', distanceKm: 1268 },
    { origin: 'Recife, PE', destination: 'Salvador, BA', distanceKm: 766 },
    { origin: 'Fortaleza, CE', destination: 'Brasília, DF', distanceKm: 2145 },
    { origin: 'Natal, RN', destination: 'Recife, PE', distanceKm: 299 },
    { origin: 'Maceió, AL', destination: 'Recife, PE', distanceKm: 240 },
    { origin: 'São Luís, MA', destination: 'Brasília, DF', distanceKm: 2125 },
    { origin: 'Teresina, PI', destination: 'Brasília, DF', distanceKm: 1704 },

    // Rotas Sul
    { origin: 'Curitiba, PR', destination: 'Brasília, DF', distanceKm: 1110 },
    { origin: 'Rio de Janeiro, RJ', destination: 'Curitiba, PR', distanceKm: 920 },
    { origin: 'São Paulo, SP', destination: 'Curitiba, PR', distanceKm: 408 },
    { origin: 'Porto Alegre, RS', destination: 'Curitiba, PR', distanceKm: 1090 },
    { origin: 'Curitiba, PR', destination: 'Londrina, PR', distanceKm: 380 },
    { origin: 'Brasília, DF', destination: 'Porto Alegre, RS', distanceKm: 2020 },
    { origin: 'Santa Maria, RS', destination: 'Porto Alegre, RS', distanceKm: 290 },
    { origin: 'Florianópolis, SC', destination: 'Porto Alegre, RS', distanceKm: 640 },

    // Rotas Centro-Oeste
    { origin: 'Brasília, DF', destination: 'Goiânia, GO', distanceKm: 209 },
    { origin: 'Brasília, DF', destination: 'Cuiabá, MT', distanceKm: 925 },
    { origin: 'Goiânia, GO', destination: 'São Paulo, SP', distanceKm: 917 },
    { origin: 'Campo Grande, MS', destination: 'Brasília, DF', distanceKm: 1315 },
    { origin: 'Cuiabá, MT', destination: 'Goiânia, GO', distanceKm: 1070 },

    // Rotas adicionais importantes
    { origin: 'Santos, SP', destination: 'São Paulo, SP', distanceKm: 72 },
    { origin: 'Jundiaí, SP', destination: 'São Paulo, SP', distanceKm: 60 },
    { origin: 'Ribeirão Preto, SP', destination: 'São Paulo, SP', distanceKm: 310 },
    { origin: 'Araçatuba, SP', destination: 'São Paulo, SP', distanceKm: 520 },
    { origin: 'Vitória, ES', destination: 'Rio de Janeiro, RJ', distanceKm: 521 },
  ],

  /**
   * Retorna um array único e ordenado de todos os nomes de cidades encontradas nas rotas
   * Extrai cidades tanto da origem quanto do destino
   * Remove duplicatas e ordena alfabeticamente
   * 
   * @returns {Array<string>} Array de nomes de cidades (ex: ["Araçatuba, SP", "Belém, PA", ...])
   */
  getAllCities: function() {
    // Usar Set para remover duplicatas automaticamente
    const citiesSet = new Set();

    // Iterar sobre todas as rotas e adicionar origem e destino ao Set
    this.routes.forEach(route => {
      citiesSet.add(route.origin);
      citiesSet.add(route.destination);
    });

    // Converter Set para array e ordenar alfabeticamente
    return Array.from(citiesSet).sort();
  },

  /**
   * Encontra a distância em quilômetros entre duas cidades
   * Busca a rota em ambas as direções (origem-destino e destino-origem)
   * Normaliza a entrada: remove espaços em branco e converte para minúsculas para comparação
   * 
   * @param {string} origin - Nome da cidade de origem (ex: "São Paulo, SP")
   * @param {string} destination - Nome da cidade de destino (ex: "Rio de Janeiro, RJ")
   * @returns {number|null} Distância em km se encontrada, null caso contrário
   */
  findDistance: function(origin, destination) {
    // Normalizar entrada: converter para minúsculas e remover espaços em branco extras
    const normalizedOrigin = origin.trim().toLowerCase();
    const normalizedDestination = destination.trim().toLowerCase();

    // Buscar rota na direção origem -> destino
    const routeForward = this.routes.find(route =>
      route.origin.toLowerCase() === normalizedOrigin &&
      route.destination.toLowerCase() === normalizedDestination
    );

    // Se encontrou na direção direta, retornar a distância
    if (routeForward) {
      return routeForward.distanceKm;
    }

    // Buscar rota na direção inversa (destino -> origem)
    const routeReverse = this.routes.find(route =>
      route.origin.toLowerCase() === normalizedDestination &&
      route.destination.toLowerCase() === normalizedOrigin
    );

    // Se encontrou na direção inversa, retornar a distância (é a mesma)
    if (routeReverse) {
      return routeReverse.distanceKm;
    }

    // Retornar null se nenhuma rota foi encontrada
    return null;
  }
};
