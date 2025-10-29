/**
 * Carregador Dinâmico de Módulos de Caixa
 * Injeta conteúdo de abertura/fechamento no app-content
 */
class CaixaLoader {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/caixa';
        this.scriptsCarregados = false;
        this.init();
    }

    async init() {
        console.log('🚀 CaixaLoader inicializado');
        this.configurarEventListenersMenu();
    }

    configurarEventListenersMenu() {
        // Detecta cliques em TODOS os links do menu
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            const modulo = link.getAttribute('data-modulo');
            const acao = link.getAttribute('data-acao');
            
            console.log('🔗 Link clicado (Caixa):', { href, modulo, acao });

            // Verifica se é um link do caixa pelos atributos (PRIMEIRO HTML)
            if (modulo === 'caixa') {
                e.preventDefault();
                console.log(`💰 Caixa detectado: ${acao}`);
                
                if (acao === 'abrir') {
                    this.carregarAberturaCaixa();
                } else if (acao === 'fechar') {
                    this.carregarFechamentoCaixa();
                }
                return;
            }

            // Também verifica pelo href como fallback (SEGUNDO HTML)
            if (href && href.includes('caixa')) {
                e.preventDefault();
                console.log(`💰 Caixa detectado pelo href: ${href}`);
                
                if (href.includes('abrir')) {
                    this.carregarAberturaCaixa();
                } else if (href.includes('fechar')) {
                    this.carregarFechamentoCaixa();
                }
            }
        });
    }

    async carregarScriptsCaixa() {
        if (this.scriptsCarregados) return;

        return new Promise((resolve, reject) => {
            // Carrega CaixaBase.js
            const baseScript = document.createElement('script');
            baseScript.src = '../js/CaixaBase.js';
            baseScript.onload = () => {
                // Carrega AberturaCaixa.js
                const aberturaScript = document.createElement('script');
                aberturaScript.src = '../js/AberturaCaixa.js';
                aberturaScript.onload = () => {
                    // Carrega FechamentoCaixa.js
                    const fechamentoScript = document.createElement('script');
                    fechamentoScript.src = '../js/FechamentoCaixa.js';
                    fechamentoScript.onload = () => {
                        this.scriptsCarregados = true;
                        console.log('✅ Todos os scripts do caixa carregados');
                        resolve();
                    };
                    fechamentoScript.onerror = reject;
                    document.head.appendChild(fechamentoScript);
                };
                aberturaScript.onerror = reject;
                document.head.appendChild(aberturaScript);
            };
            baseScript.onerror = reject;
            document.head.appendChild(baseScript);
        });
    }

    async carregarAberturaCaixa() {
        try {
            console.log('📥 Carregando módulo de abertura...');

            // Carrega os scripts primeiro
            await this.carregarScriptsCaixa();

            // HTML do módulo de abertura
            const html = `
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="page-title">Controle de Caixa</h2>
                        <p class="text-muted">Gerencie a abertura e fechamento do caixa do bazar</p>
                    </div>
                </div>

                <div class="caixa-container">
                    <!-- Card do último fechamento -->
                    <div class="card card-caixa shadow-sm">
                        <div class="card-header bg-light">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-chart-bar me-2"></i>Último Fechamento
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="info-ultimo-caixa p-3 mb-3 rounded">
                                <div class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Carregando...</span>
                                    </div>
                                    <p class="mt-2 mb-0 text-muted">Carregando dados...</p>
                                </div>
                            </div>
                            
                            <div class="caixa-stats">
                                <h5><i class="fas fa-info-circle me-2"></i>Resumo</h5>
                                <div class="row">
                                    <div class="col-6">
                                        <small class="opacity-75">Total de Vendas:</small>
                                        <strong class="d-block">R$ 0,00</strong>
                                    </div>
                                    <div class="col-6">
                                        <small class="opacity-75">Retiradas:</small>
                                        <strong class="d-block">R$ 0,00</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card para abrir novo caixa -->
                    <div class="card card-caixa shadow-sm">
                        <div class="card-header bg-light">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-cash-register me-2"></i>Abrir Novo Caixa
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="mensagensAbertura" class="mb-3" style="display: none;"></div>

                            <p class="text-muted mb-4">
                                Informe o valor inicial em dinheiro para iniciar as operações do dia.
                            </p>

                            <form id="formAbrirCaixa">
                                <div class="mb-4">
                                    <label for="valorAbertura" class="form-label fw-bold">
                                        <i class="fas fa-money-bill-wave me-1"></i>Valor de Abertura *
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text">R$</span>
                                        <input type="text"
                                               class="form-control"
                                               id="valorAbertura"
                                               placeholder="0,00"
                                               required
                                               maxlength="15">
                                    </div>
                                    <div id="erroValorAbertura" class="text-danger mt-1 small" style="display: none;"></div>
                                    <small class="text-muted">Valor em espécie para iniciar o caixa</small>
                                </div>

                                <div class="mb-4">
                                    <label for="observacao" class="form-label">
                                        <i class="fas fa-sticky-note me-1"></i>Observação (opcional)
                                    </label>
                                    <textarea class="form-control"
                                              id="observacao"
                                              rows="3"
                                              placeholder="Alguma observação sobre a abertura (turno, responsável, etc.)..."></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Botão de ação -->
                <div class="text-center mt-4">
                    <button id="btnAbrirCaixa" class="btn btn-success btn-abrir-caixa">
                        <i class="fas fa-cash-register me-2"></i>Abrir Caixa
                    </button>
                </div>
                
                <!-- Status e horário -->
                <div class="hora-atual-container mt-4">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <small class="text-muted d-block">Horário Atual do Sistema:</small>
                            <strong id="horaAtual" class="fs-5 text-primary"></strong>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <small class="text-muted d-block">Status do Caixa:</small>
                            <div class="status-caixa">
                                <span class="badge bg-warning">Carregando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Injeta no app-content
            this.injetarConteudo(html);

            // Inicializa o módulo de abertura
            setTimeout(() => {
                if (typeof AberturaCaixa !== 'undefined') {
                    window.caixaManager = new AberturaCaixa();
                    console.log('✅ Módulo de abertura inicializado');
                }
            }, 100);

        } catch (error) {
            console.error('❌ Erro ao carregar abertura:', error);
            this.mostrarErro('Erro ao carregar módulo de abertura');
        }
    }

    async carregarFechamentoCaixa() {
        try {
            console.log('📥 Carregando módulo de fechamento...');

            // Carrega os scripts primeiro
            await this.carregarScriptsCaixa();

            // HTML do módulo de fechamento
            const html = `
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="page-title">Fechamento de Caixa</h2>
                        <p class="text-muted">Realize o fechamento do caixa atual do bazar</p>
                    </div>
                </div>

                <div class="caixa-container">
                    <!-- Card do caixa atual (ESQUERDA) -->
                    <div class="card card-caixa shadow-sm">
                        <div class="card-header bg-light">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-cash-register me-2"></i>Caixa Atual
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="info-caixa-atual" class="info-caixa-atual p-3 mb-3 rounded">
                                <div class="text-center">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Carregando...</span>
                                    </div>
                                    <p class="mt-2 mb-0 text-muted">Carregando dados do caixa...</p>
                                </div>
                            </div>
                            
                            <div class="resumo-valores">
                                <h5 class="text-center mb-3">
                                    <i class="fas fa-chart-bar me-2"></i>Resumo do Dia
                                </h5>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Vendas à Vista:</span>
                                    <strong id="vendas-vista">R$ 0,00</strong>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Vendas Cartão:</span>
                                    <strong id="vendas-cartao">R$ 0,00</strong>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Outras Entradas:</span>
                                    <strong id="outras-entradas">R$ 0,00</strong>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Retiradas/Sangrias:</span>
                                    <strong id="retiradas" class="text-warning">R$ 0,00</strong>
                                </div>
                                
                                <hr>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Total de Vendas:</span>
                                    <strong id="total-vendas" class="text-primary">R$ 0,00</strong>
                                </div>
                                
                                <div class="d-flex justify-content-between">
                                    <span>Saldo Esperado:</span>
                                    <strong id="saldo-esperado">R$ 0,00</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Card para fechar caixa (DIREITA) -->
                    <div class="card card-caixa shadow-sm">
                        <div class="card-header bg-light">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-lock me-2"></i>Fechar Caixa
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="mensagensFechamento" class="mb-3" style="display: none;"></div>

                            <p class="text-muted mb-4">
                                Confirme os valores encontrados no caixa para realizar o fechamento.
                            </p>

                            <form id="formFecharCaixa">
                                <div class="mb-4">
                                    <label for="valorDinheiro" class="form-label fw-bold">
                                        <i class="fas fa-money-bill-wave me-1"></i>Valor em Dinheiro *
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text">R$</span>
                                        <input type="text"
                                               class="form-control"
                                               id="valorDinheiro"
                                               placeholder="0,00"
                                               required
                                               maxlength="15">
                                    </div>
                                    <div id="erroValorDinheiro" class="text-danger mt-1 small" style="display: none;"></div>
                                    <small class="text-muted">Valor total encontrado em espécie</small>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Botões de ação -->
                <div class="text-center mt-4">
                    <button id="btnConferir" class="btn btn-info btn-lg me-3">
                        <i class="fas fa-calculator me-2"></i>Conferir Valores
                    </button>
                    <button id="btnFecharCaixa" class="btn btn-warning btn-fechar-caixa" disabled>
                        <i class="fas fa-lock me-2"></i>Fechar Caixa
                    </button>
                </div>
                
                <!-- Status e horário -->
                <div class="hora-atual-container mt-4">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <small class="text-muted d-block">Horário Atual do Sistema:</small>
                            <strong id="horaAtual" class="fs-5 text-primary"></strong>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <small class="text-muted d-block">Status do Caixa:</small>
                            <div class="status-caixa">
                                <span class="badge bg-warning">Carregando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Injeta no app-content
            this.injetarConteudo(html);

            // Inicializa o módulo de fechamento
            setTimeout(() => {
                if (typeof FechamentoCaixa !== 'undefined') {
                    window.caixaManager = new FechamentoCaixa();
                    console.log('✅ Módulo de fechamento inicializado');
                }
            }, 100);

        } catch (error) {
            console.error('❌ Erro ao carregar fechamento:', error);
            this.mostrarErro('Erro ao carregar módulo de fechamento');
        }
    }

    injetarConteudo(html) {
        const appContent = document.getElementById('app-content');
        if (appContent) {
            appContent.innerHTML = html;
            appContent.classList.remove('center-content');
            console.log('✅ Conteúdo injetado no app-content');
        }
    }

    mostrarErro(mensagem) {
        const appContent = document.getElementById('app-content');
        if (appContent) {
            appContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>${mensagem}
                </div>
            `;
        }
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.caixaLoader = new CaixaLoader();
    console.log('🎯 CaixaLoader pronto - clique em "Abrir Caixa" ou "Fechar Caixa" no menu');
});