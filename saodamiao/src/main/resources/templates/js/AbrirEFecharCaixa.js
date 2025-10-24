/**
 * Sistema Completo de Gerenciamento de Caixa
 * Controla a abertura e fechamento do caixa do bazar
 * @version 3.0 - REST API
 * @author Seu Nome
 */

class CaixaManager {
    constructor(modo = 'abertura') {
        this.baseURL = 'http://localhost:8080/api/caixa';
        this.caixaAberto = null;
        this.ultimoCaixa = null;
        this.voluntarioLogado = null;
        this.modo = modo; // 'abertura' ou 'fechamento'
        this.init();
    }

    async init() {
        console.log('Inicializando CaixaManager no modo:', this.modo);

        await this.carregarUsuarioLogado();
        await this.verificarStatusCaixa();

        if (this.modo === 'abertura') {
            await this.buscarUltimoCaixa();
            this.configurarEventListenersAbertura();
        }

        this.iniciarAtualizacaoHora();
        console.log('CaixaManager inicializado com sucesso');
    }

    // ========== MÉTODOS COMPARTILHADOS ==========

    async carregarUsuarioLogado() {
        try {
            // Simulando usuário logado - ajuste conforme sua autenticação
            this.voluntarioLogado = {
                idvoluntario: 1,
                nome: "Administrador"
            };
            console.log('Usuário logado:', this.voluntarioLogado);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    async verificarStatusCaixa() {
        try {
            console.log('Verificando status do caixa...');
            const response = await fetch(`${this.baseURL}/status`);
            if (response.ok) {
                const caixaAberto = await response.json();
                this.caixaAberto = caixaAberto;
                console.log('Status do caixa:', this.caixaAberto);
                this.atualizarInterfaceStatus();
            } else {
                console.warn('Não foi possível verificar status do caixa');
                this.caixaAberto = false;
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            this.caixaAberto = false;
            this.mostrarNotificacao('Erro ao verificar status do caixa', 'danger');
        }
    }

    async buscarUltimoCaixa() {
        try {
            console.log('Buscando último caixa...');
            const response = await fetch(`${this.baseURL}/ultimo`);
            if (response.ok) {
                const data = await response.json();
                this.ultimoCaixa = data;
                console.log('Último caixa:', this.ultimoCaixa);
                this.atualizarInterfaceUltimoCaixa();
            }
        } catch (error) {
            console.error('Erro ao buscar último caixa:', error);
        }
    }

    // ========== MÉTODOS DE VALIDAÇÃO VISUAL ==========

    mostrarErroCampo(campoId, mensagem) {
        const campo = document.getElementById(campoId);
        const erroDiv = document.getElementById('erro' + this.capitalizeFirst(campoId));

        if (campo) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
        }

        if (erroDiv) {
            erroDiv.textContent = mensagem;
            erroDiv.style.display = 'block';
        }
    }

    limparErroCampo(campoId) {
        const campo = document.getElementById(campoId);
        const erroDiv = document.getElementById('erro' + this.capitalizeFirst(campoId));

        if (campo) {
            campo.classList.remove('is-invalid');
            campo.classList.remove('is-valid');
        }

        if (erroDiv) {
            erroDiv.style.display = 'none';
        }
    }

    mostrarMensagem(containerId, mensagem, tipo) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let classe = 'alert alert-danger';
        let icone = 'fas fa-exclamation-circle';

        if (tipo === 'success') {
            classe = 'alert alert-success';
            icone = 'fas fa-check-circle';
        } else if (tipo === 'warning') {
            classe = 'alert alert-warning';
            icone = 'fas fa-exclamation-triangle';
        }

        container.innerHTML = `
            <div class="${classe} alert-dismissible fade show">
                <i class="${icone} me-2"></i>${mensagem}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        container.style.display = 'block';

        // Auto-remover após 5 segundos (exceto sucesso)
        if (tipo !== 'success') {
            setTimeout(() => {
                container.style.display = 'none';
            }, 5000);
        }
    }

    limparMensagens(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    // Método utilitário
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // ========== MÉTODOS DE ABERTURA ==========

    async abrirCaixa(valorAbertura, observacao) {
        try {
            if (!this.voluntarioLogado) {
                throw new Error('Nenhum voluntário logado');
            }

            // Preparar dados para o REST
            const caixaData = {
                codigo: this.voluntarioLogado.idvoluntario, // ID do voluntário
                valorAbertura: parseFloat(valorAbertura)
            };

            // Adicionar observação apenas se existir
            if (observacao && observacao.trim() !== '') {
                caixaData.mensagem = observacao;
            }

            console.log('Enviando dados para abertura:', caixaData);

            const response = await fetch(`${this.baseURL}/abrir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(caixaData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erro ' + response.status + ': ' + errorText);
            }

            const resultado = await response.json();
            console.log('Resposta da API:', resultado);

            if (resultado.codigo === 1) {
                this.caixaAberto = true;
                this.atualizarInterfaceStatus();
                this.mostrarNotificacao(resultado.mensagem, 'success');
                this.limparFormulario();

                // Redirecionar para vendas após sucesso
                setTimeout(() => {
                    window.location.href = '../vendas/efetuar.html';
                }, 2000);

                return resultado;
            } else {
                if (resultado.mensagem) {
                    throw new Error(resultado.mensagem);
                } else {
                    throw new Error('Erro desconhecido ao abrir caixa');
                }
            }
        } catch (error) {
            console.error('Erro ao abrir caixa:', error);
            this.mostrarNotificacao(error.message, 'danger');
            throw error;
        }
    }

    configurarEventListenersAbertura() {
        const btnAbrirCaixa = document.getElementById('btnAbrirCaixa');
        const valorAbertura = document.getElementById('valorAbertura');

        console.log('Configurando event listeners para abertura...');
        console.log('btnAbrirCaixa encontrado:', !!btnAbrirCaixa);
        console.log('valorAbertura encontrado:', !!valorAbertura);

        if (btnAbrirCaixa) {
            btnAbrirCaixa.addEventListener('click', () => {
                console.log('Botão abrir caixa clicado!');
                this.handleAbrirCaixa();
            });
        } else {
            console.error('Botão btnAbrirCaixa não encontrado!');
        }

        if (valorAbertura) {
            // Validação em tempo real
            valorAbertura.addEventListener('input', (e) => {
                this.limparErroCampo('valorAbertura');
                let value = e.target.value.replace(/\D/g, '');
                value = (value / 100).toFixed(2);
                if (value) {
                    e.target.value = this.formatarMoeda(parseFloat(value));

                    // Validação visual em tempo real
                    const valorNumerico = this.parseMoeda(e.target.value);
                    if (valorNumerico > 0) {
                        e.target.classList.add('is-valid');
                    }
                } else {
                    e.target.value = '';
                    e.target.classList.remove('is-valid');
                }
            });

            valorAbertura.addEventListener('blur', (e) => {
                const valorNumerico = this.parseMoeda(e.target.value);
                if (valorNumerico <= 0 && e.target.value) {
                    this.mostrarErroCampo('valorAbertura', 'Valor deve ser maior que zero');
                }
            });

            valorAbertura.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAbrirCaixa();
                }
            });
        }

        // Adicionar também o listener no formulário para prevenir submit padrão
        const formAbrirCaixa = document.getElementById('formAbrirCaixa');
        if (formAbrirCaixa) {
            formAbrirCaixa.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAbrirCaixa();
            });
        }
    }

    async handleAbrirCaixa() {
        console.log('Iniciando processo de abertura de caixa...');

        const valorAberturaInput = document.getElementById('valorAbertura');
        const observacaoInput = document.getElementById('observacao');

        // Limpar mensagens anteriores
        this.limparMensagens('mensagensAbertura');
        this.limparErroCampo('valorAbertura');

        // Validação do valor
        if (!valorAberturaInput || !valorAberturaInput.value) {
            this.mostrarErroCampo('valorAbertura', 'Informe o valor de abertura!');
            this.mostrarMensagem('mensagensAbertura', 'É necessário informar um valor para abrir o caixa.', 'warning');
            if (valorAberturaInput) {
                valorAberturaInput.focus();
            }
            return;
        }

        const valorAbertura = this.parseMoeda(valorAberturaInput.value);
        console.log('Valor de abertura parseado:', valorAbertura);

        if (valorAbertura <= 0) {
            this.mostrarErroCampo('valorAbertura', 'O valor deve ser maior que zero!');
            this.mostrarMensagem('mensagensAbertura', 'O valor de abertura deve ser maior que R$ 0,00.', 'warning');
            valorAberturaInput.focus();
            return;
        }

        if (this.caixaAberto) {
            this.mostrarMensagem('mensagensAbertura', 'Já existe um caixa aberto! É necessário fechar o caixa atual antes de abrir outro.', 'warning');
            return;
        }

        let observacao = '';
        if (observacaoInput && observacaoInput.value) {
            observacao = observacaoInput.value.trim();
        }

        // Se passou nas validações, marca como válido
        valorAberturaInput.classList.add('is-valid');

        if (confirm(`Confirma a abertura do caixa com R$ ${this.formatarMoeda(valorAbertura)}?`)) {
            const btnAbrir = document.getElementById('btnAbrirCaixa');
            const originalText = btnAbrir.innerHTML;

            try {
                btnAbrir.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Abrindo...';
                btnAbrir.disabled = true;

                await this.abrirCaixa(valorAbertura, observacao);
            } catch (error) {
                // Erro já tratado no método abrirCaixa
                console.error('Erro no handleAbrirCaixa:', error);
            } finally {
                btnAbrir.innerHTML = originalText;
                btnAbrir.disabled = false;
            }
        }
    }

    // ========== MÉTODOS DE INTERFACE ==========

    atualizarInterfaceStatus() {
        const statusElement = document.querySelector('.status-caixa');
        if (!statusElement) {
            console.warn('Elemento .status-caixa não encontrado');
            return;
        }

        console.log('Atualizando interface status. Caixa aberto:', this.caixaAberto);

        if (this.caixaAberto) {
            statusElement.innerHTML = '<span class="badge bg-success">Caixa Aberto</span>';

            // Desabilitar abertura se caixa já estiver aberto
            if (this.modo === 'abertura') {
                const btnAbrir = document.getElementById('btnAbrirCaixa');
                if (btnAbrir) {
                    btnAbrir.disabled = true;
                    btnAbrir.innerHTML = '<i class="fas fa-check me-2"></i>Caixa Já Aberto';
                    this.mostrarMensagem('mensagensAbertura', 'Já existe um caixa aberto. Feche o caixa atual antes de abrir outro.', 'warning');
                }
            }
        } else {
            statusElement.innerHTML = '<span class="badge bg-warning">Caixa Fechado</span>';
        }
    }

    atualizarInterfaceUltimoCaixa() {
        const container = document.querySelector('.info-ultimo-caixa');
        if (!container) {
            console.warn('Elemento .info-ultimo-caixa não encontrado');
            return;
        }

        if (!this.ultimoCaixa) {
            container.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>Carregando dados do último caixa...</div>';
            return;
        }

        if (this.ultimoCaixa.codigo === -4 || !this.ultimoCaixa.dataAbertura) {
            container.innerHTML = '<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>Nenhum caixa encontrado no histórico.</div>';
            return;
        }

        const html = `
            <div class="row">
                <div class="col-6">
                    <small class="text-muted d-block">Abertura:</small>
                    <strong class="text-success">R$ ${this.formatarMoeda(this.ultimoCaixa.valorAbertura)}</strong>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block">Fechamento:</small>
                    <strong class="text-primary">R$ ${this.formatarMoeda(this.ultimoCaixa.valorFechamento)}</strong>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-6">
                    <small class="text-muted d-block">Data Abertura:</small>
                    <strong>${this.formatarData(this.ultimoCaixa.dataAbertura)}</strong>
                </div>
                <div class="col-6">
                    <small class="text-muted d-block">Data Fechamento:</small>
                    <strong>${this.formatarData(this.ultimoCaixa.dataFechamento)}</strong>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ========== UTILITÁRIOS ==========

    formatarMoeda(valor) {
        if (!valor && valor !== 0) return '0,00';

        return parseFloat(valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    parseMoeda(valorString) {
        if (!valorString) {
            return 0;
        }
        const valorLimpo = valorString.replace(/\./g, '').replace(',', '.');
        return parseFloat(valorLimpo) || 0;
    }

    formatarData(dataString) {
        try {
            if (!dataString) {
                return 'N/A';
            }
            const data = new Date(dataString);
            if (isNaN(data.getTime())) {
                return dataString;
            }
            return data.toLocaleString('pt-BR');
        } catch (error) {
            console.warn('Erro ao formatar data:', dataString, error);
            return dataString || 'N/A';
        }
    }

    limparFormulario() {
        const valorAbertura = document.getElementById('valorAbertura');
        const observacao = document.getElementById('observacao');

        if (valorAbertura) {
            valorAbertura.value = '';
            valorAbertura.classList.remove('is-valid');
        }
        if (observacao) {
            observacao.value = '';
        }

        this.limparMensagens('mensagensAbertura');
    }

    mostrarNotificacao(mensagem, tipo) {
        console.log(`Notificação [${tipo}]:`, mensagem);

        // Usar o sistema de mensagens integrado
        this.mostrarMensagem('mensagensAbertura', mensagem, tipo);

        // Fallback para notify (mantém o anterior como backup)
        if (typeof $.notify === 'function') {
            let icone = 'fas fa-info-circle';
            if (tipo === 'success') {
                icone = 'fas fa-check';
            } else if (tipo === 'warning') {
                icone = 'fas fa-exclamation-triangle';
            } else if (tipo === 'danger') {
                icone = 'fas fa-times';
            }

            $.notify({
                icon: icone,
                message: mensagem
            }, {
                type: tipo,
                placement: { from: "top", align: "right" },
                delay: 5000,
                animate: { enter: 'animated fadeInDown', exit: 'animated fadeOutUp' }
            });
        }
    }

    iniciarAtualizacaoHora() {
        const atualizar = () => {
            const now = new Date();
            const horaElement = document.getElementById('horaAtual');
            if (horaElement) {
                horaElement.innerText = now.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        };

        setInterval(atualizar, 1000);
        atualizar();
    }
}

// Função de inicialização global
function inicializarSistemaCaixa() {
    console.log('Inicializando sistema de caixa...');

    const path = window.location.pathname;
    let modo = 'abertura';

    if (path.includes('fechar.html')) {
        modo = 'fechamento';
    }

    console.log('Modo detectado:', modo);

    try {
        window.caixaManager = new CaixaManager(modo);
        console.log('Sistema de caixa inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar sistema de caixa:', error);

        // Fallback básico
        const btnAbrir = document.getElementById('btnAbrirCaixa');
        if (btnAbrir) {
            btnAbrir.addEventListener('click', () => {
                alert('Sistema temporariamente indisponível. Tente novamente.');
            });
        }
    }
}

// Inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSistemaCaixa);
} else {
    inicializarSistemaCaixa();
}

// Export para uso global
window.CaixaManager = CaixaManager;
window.inicializarSistemaCaixa = inicializarSistemaCaixa;

// Debug helper
window.debugCaixa = function() {
    console.log('=== DEBUG CAIXA ===');
    console.log('caixaManager:', window.caixaManager);
    console.log('btnAbrirCaixa:', document.getElementById('btnAbrirCaixa'));
    console.log('valorAbertura:', document.getElementById('valorAbertura'));
    console.log('=== FIM DEBUG ===');
};