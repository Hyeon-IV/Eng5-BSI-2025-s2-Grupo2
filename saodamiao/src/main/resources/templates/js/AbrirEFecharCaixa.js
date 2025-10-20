/**
 * Sistema de Gerenciamento de Caixa
 * Controla a abertura e fechamento do caixa do bazar
 * @version 1.0
 * @author Seu Nome
 */

class CaixaManager {
    constructor() {
        this.baseURL = 'http://localhost:8080/saodamiao';
        this.caixaAberto = null;
        this.voluntarioLogado = null;
        this.ultimoFechamento = null;
        this.init();
    }

    async init() {
        try {
            await this.carregarUsuarioLogado();
            await this.verificarStatusCaixa();
            await this.buscarUltimoFechamento();
            this.configurarEventListeners();
            this.configurarMascaras();
        } catch (error) {
            console.error('Erro na inicialização do CaixaManager:', error);
            this.mostrarNotificacao('Erro ao inicializar sistema de caixa', 'danger');
        }
    }

    /**
     * Carrega dados do voluntário logado
     */
    async carregarUsuarioLogado() {
        try {
            // Simulação - substitua pela sua lógica de autenticação
            this.voluntarioLogado = {
                idvoluntario: 1,
                nome: "Administrador",
                email: "admin@ong.com"
            };

            // Atualizar interface com nome do usuário
            const userElement = document.querySelector('.profile-username .fw-bold');
            if (userElement) {
                userElement.textContent = this.voluntarioLogado.nome;
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            throw new Error('Não foi possível carregar dados do usuário');
        }
    }

    /**
     * Verifica status atual do caixa
     */
    async verificarStatusCaixa() {
        try {
            const response = await fetch(`${this.baseURL}/caixa/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.caixaAberto = data.caixaAberto;
            } else {
                // Fallback: verificar via último caixa
                await this.verificarStatusViaUltimoCaixa();
            }
        } catch (error) {
            console.warn('Erro na verificação de status, usando fallback:', error);
            await this.verificarStatusViaUltimoCaixa();
        } finally {
            this.atualizarInterfaceStatus();
        }
    }

    /**
     * Verificação alternativa de status
     */
    async verificarStatusViaUltimoCaixa() {
        try {
            const response = await fetch(`${this.baseURL}/caixa/ultimo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.caixaAberto = data && !data.dataFechamento ? data : null;
            }
        } catch (error) {
            console.error('Erro na verificação alternativa:', error);
            this.caixaAberto = null;
        }
    }

    /**
     * Abre um novo caixa
     */
    async abrirCaixa(valorAbertura, observacao = '') {
        this.mostrarLoading(true);

        try {
            if (!this.voluntarioLogado) {
                throw new Error('Nenhum voluntário logado');
            }

            const caixaData = {
                voluntario: this.voluntarioLogado,
                valorAbertura: parseFloat(valorAbertura),
                observacao: observacao
            };

            const response = await fetch(`${this.baseURL}/caixa/abrir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                },
                body: JSON.stringify(caixaData)
            });

            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }

            const resultado = await response.json();

            if (resultado.codigo === 1) {
                this.caixaAberto = resultado;
                this.atualizarInterfaceStatus();
                this.mostrarNotificacao(resultado.mensagem, 'success');
                this.limparFormulario();

                // Redirecionar para vendas
                setTimeout(() => {
                    window.location.href = '../bazar/vendas/efetuar.html';
                }, 1500);

                return resultado;
            } else {
                throw new Error(resultado.mensagem || 'Erro ao abrir caixa');
            }
        } catch (error) {
            console.error('Erro ao abrir caixa:', error);
            this.mostrarNotificacao(error.message, 'danger');
            throw error;
        } finally {
            this.mostrarLoading(false);
        }
    }

    /**
     * Fecha o caixa atual
     */
    async fecharCaixa(valorFechamento, observacao = '') {
        this.mostrarLoading(true);

        try {
            if (!this.voluntarioLogado) {
                throw new Error('Nenhum voluntário logado');
            }

            const fechamentoData = {
                voluntario: this.voluntarioLogado,
                valorFechamento: parseFloat(valorFechamento),
                observacao: observacao
            };

            const response = await fetch(`${this.baseURL}/caixa/fechar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                },
                body: JSON.stringify(fechamentoData)
            });

            if (!response.ok) {
                throw new Error('Erro na comunicação com o servidor');
            }

            const resultado = await response.json();

            if (resultado.codigo === 1) {
                this.caixaAberto = null;
                this.atualizarInterfaceStatus();
                this.mostrarNotificacao(resultado.mensagem, 'success');
                await this.buscarUltimoFechamento();
                return resultado;
            } else {
                throw new Error(resultado.mensagem || 'Erro ao fechar caixa');
            }
        } catch (error) {
            console.error('Erro ao fechar caixa:', error);
            this.mostrarNotificacao(error.message, 'danger');
            throw error;
        } finally {
            this.mostrarLoading(false);
        }
    }

    /**
     * Busca último fechamento
     */
    async buscarUltimoFechamento() {
        try {
            const response = await fetch(`${this.baseURL}/caixa/ultimo-fechamento`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.getAuthToken()
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.ultimoFechamento = data;
                this.atualizarCardUltimoFechamento(data);
            }
        } catch (error) {
            console.error('Erro ao buscar último fechamento:', error);
            this.mostrarMensagemSemFechamento();
        }
    }

    /**
     * Atualiza interface baseada no status
     */
    atualizarInterfaceStatus() {
        const statusElement = document.querySelector('.status-caixa');
        const btnAbrirCaixa = document.getElementById('btnAbrirCaixa');
        const cardAbertura = document.querySelector('.card-caixa:last-child');
        const valorAberturaInput = document.getElementById('valorAbertura');

        if (this.caixaAberto) {
            // Caixa ABERTO
            if (statusElement) {
                statusElement.innerHTML = '<span class="badge bg-success">Caixa Aberto</span>';
            }

            if (btnAbrirCaixa) {
                btnAbrirCaixa.innerHTML = '<i class="fas fa-lock-open me-2"></i>Caixa Já Está Aberto';
                btnAbrirCaixa.className = 'btn btn-warning btn-abrir-caixa';
                btnAbrirCaixa.disabled = true;
            }

            if (cardAbertura) {
                cardAbertura.classList.add('disabled');
            }

            if (valorAberturaInput) {
                valorAberturaInput.disabled = true;
            }
        } else {
            // Caixa FECHADO
            if (statusElement) {
                statusElement.innerHTML = '<span class="badge bg-warning">Caixa Fechado</span>';
            }

            if (btnAbrirCaixa) {
                btnAbrirCaixa.innerHTML = '<i class="fas fa-cash-register me-2"></i>Abrir Caixa';
                btnAbrirCaixa.className = 'btn btn-success btn-abrir-caixa';
                btnAbrirCaixa.disabled = false;
            }

            if (cardAbertura) {
                cardAbertura.classList.remove('disabled');
            }

            if (valorAberturaInput) {
                valorAberturaInput.disabled = false;
            }
        }
    }

    /**
     * Atualiza card do último fechamento
     */
    atualizarCardUltimoFechamento(ultimoCaixa) {
        if (!ultimoCaixa) {
            this.mostrarMensagemSemFechamento();
            return;
        }

        const container = document.querySelector('.info-ultimo-caixa');
        if (!container) return;

        const valorFechamento = ultimoCaixa.valorFechamento || 0;
        const valorAbertura = ultimoCaixa.valorAbertura || 0;
        const totalVendas = valorFechamento - valorAbertura;

        container.innerHTML = `
            <div class="row">
                <div class="col-6">
                    <small class="text-muted d-block">Valor Final:</small>
                    <strong class="text-success fs-5">R$ ${this.formatarMoeda(valorFechamento)}</strong>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block">Data/Hora:</small>
                    <strong>${this.formatarData(ultimoCaixa.dataFechamento)}</strong>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-4">
                    <small class="text-muted d-block">Total de Vendas:</small>
                    <strong class="text-primary">R$ ${this.formatarMoeda(totalVendas)}</strong>
                </div>
                <div class="col-4">
                    <small class="text-muted d-block">Retiradas:</small>
                    <strong class="text-warning">R$ ${this.formatarMoeda(0)}</strong>
                </div>
                <div class="col-4">
                    <small class="text-muted d-block">Diferença:</small>
                    <strong class="text-info">R$ ${this.formatarMoeda(0)}</strong>
                </div>
            </div>
        `;
    }

    /**
     * Mostra mensagem quando não há fechamentos
     */
    mostrarMensagemSemFechamento() {
        const container = document.querySelector('.info-ultimo-caixa');
        if (container) {
            container.innerHTML = `
                <div class="info-sem-fechamento">
                    <i class="fas fa-history fa-2x mb-3 text-muted"></i>
                    <h6 class="text-muted">Nenhum fechamento anterior</h6>
                    <p class="small text-muted mb-0">Não há registros de fechamento de caixa</p>
                </div>
            `;
        }
    }

    /**
     * Configura event listeners
     */
    configurarEventListeners() {
        const btnAbrirCaixa = document.getElementById('btnAbrirCaixa');

        if (btnAbrirCaixa) {
            btnAbrirCaixa.addEventListener('click', () => {
                this.handleAbrirCaixa();
            });
        }

        // Enter no campo valor
        const valorAbertura = document.getElementById('valorAbertura');
        if (valorAbertura) {
            valorAbertura.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAbrirCaixa();
                }
            });
        }

        // Botão de fechamento forçado (debug)
        const btnDebug = document.getElementById('btnDebug');
        if (btnDebug) {
            btnDebug.addEventListener('click', () => {
                this.forcarFechamentoCaixa();
            });
        }
    }

    /**
     * Configura máscaras de input
     */
    configurarMascaras() {
        const valorAbertura = document.getElementById('valorAbertura');
        if (valorAbertura) {
            valorAbertura.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = (value / 100).toFixed(2);
                e.target.value = value ? parseFloat(value).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) : '';
            });
        }
    }

    /**
     * Handler para abrir caixa
     */
    async handleAbrirCaixa() {
        const valorAbertura = document.getElementById('valorAbertura');
        const observacao = document.getElementById('observacao');

        if (!valorAbertura) {
            this.mostrarNotificacao('Campo de valor não encontrado', 'danger');
            return;
        }

        const valor = valorAbertura.value.replace(/\./g, '').replace(',', '.');

        if (!valor || parseFloat(valor) <= 0) {
            this.mostrarNotificacao('Por favor, informe um valor válido para abertura do caixa!', 'warning');
            valorAbertura.focus();
            return;
        }

        if (confirm(`Confirma a abertura do caixa com R$ ${parseFloat(valor).toFixed(2)}?`)) {
            try {
                await this.abrirCaixa(valor, observacao?.value || '');
            } catch (error) {
                // Erro já tratado no método abrirCaixa
            }
        }
    }

    // ========== MÉTODOS UTILITÁRIOS ==========

    formatarMoeda(valor) {
        return parseFloat(valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    formatarData(dataString) {
        try {
            if (!dataString) return 'N/A';
            const data = new Date(dataString);
            return data.toLocaleString('pt-BR');
        } catch (error) {
            return dataString;
        }
    }

    getAuthToken() {
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
    }

    limparFormulario() {
        const valorAbertura = document.getElementById('valorAbertura');
        const observacao = document.getElementById('observacao');

        if (valorAbertura) valorAbertura.value = '';
        if (observacao) observacao.value = '';
    }

    mostrarLoading(mostrar) {
        const btnAbrirCaixa = document.getElementById('btnAbrirCaixa');
        if (btnAbrirCaixa) {
            if (mostrar) {
                btnAbrirCaixa.disabled = true;
                btnAbrirCaixa.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Abrindo...';
                btnAbrirCaixa.classList.add('loading');
            } else {
                btnAbrirCaixa.disabled = this.caixaAberto !== null;
                btnAbrirCaixa.innerHTML = this.caixaAberto ?
                    '<i class="fas fa-lock-open me-2"></i>Caixa Já Está Aberto' :
                    '<i class="fas fa-cash-register me-2"></i>Abrir Caixa';
                btnAbrirCaixa.classList.remove('loading');
            }
        }
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        if (typeof $.notify === 'function') {
            $.notify({
                icon: this.getIconeNotificacao(tipo),
                message: mensagem
            }, {
                type: tipo,
                placement: { from: "top", align: "right" },
                delay: 4000,
                animate: { enter: 'animated fadeInDown', exit: 'animated fadeOutUp' }
            });
        } else {
            // Fallback simples
            alert(`${tipo.toUpperCase()}: ${mensagem}`);
        }
    }

    getIconeNotificacao(tipo) {
        const icones = {
            success: 'fas fa-check',
            warning: 'fas fa-exclamation-triangle',
            danger: 'fas fa-times',
            info: 'fas fa-info-circle'
        };
        return icones[tipo] || icones.info;
    }

    /**
     * Método para debug - forçar fechamento
     */
    async forcarFechamentoCaixa() {
        if (this.caixaAberto && confirm('Deseja forçar o fechamento do caixa atual?')) {
            const valor = prompt('Informe o valor de fechamento:');
            if (valor && !isNaN(valor)) {
                try {
                    await this.fecharCaixa(valor, 'Fechamento forçado via debug');
                } catch (error) {
                    console.error('Erro no fechamento forçado:', error);
                }
            }
        } else if (!this.caixaAberto) {
            alert('Nenhum caixa aberto para fechar');
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gerenciador de caixa
    window.caixaManager = new CaixaManager();

    // Configurar atualização de hora
    function atualizarHora() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const horaElement = document.getElementById('horaAtual');
        if (horaElement) {
            horaElement.innerText = now.toLocaleString('pt-BR', options);
        }
    }

    setInterval(atualizarHora, 1000);
    atualizarHora();

    // Adicionar botão de debug em ambiente de desenvolvimento
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugBtn = document.createElement('button');
        debugBtn.id = 'btnDebug';
        debugBtn.innerHTML = '🐛 Debug';
        debugBtn.className = 'btn btn-sm btn-outline-secondary debug-tool';
        debugBtn.title = 'Fechamento forçado (apenas desenvolvimento)';
        document.body.appendChild(debugBtn);
    }
});

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CaixaManager;
}