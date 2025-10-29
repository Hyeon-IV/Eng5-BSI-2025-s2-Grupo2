/**
 * Classe específica para Abertura de Caixa
 * Herda de CaixaBase
 */
class AberturaCaixa extends CaixaBase {
    constructor() {
        super();
        this.ultimoCaixa = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando AberturaCaixa...');
        await this.carregarUsuarioLogado();
        await this.verificarStatusCaixa();
        await this.buscarUltimoCaixa();
        this.configurarEventListeners();
        this.iniciarAtualizacaoHora();
        console.log('✅ AberturaCaixa inicializado com sucesso');
    }

    async buscarUltimoCaixa() {
        try {
            console.log('📋 Buscando último caixa...');
            const response = await fetch(`${this.baseURL}/ultimo`);
            if (response.ok) {
                this.ultimoCaixa = await response.json();
                console.log('📦 Último caixa:', this.ultimoCaixa);
                this.atualizarInterfaceUltimoCaixa();
            }
        } catch (error) {
            console.error('Erro ao buscar último caixa:', error);
        }
    }

    async abrirCaixa(valorAbertura, observacao) {
        try {
            if (!this.voluntarioLogado) {
                throw new Error('Nenhum voluntário logado');
            }

            const caixaData = {
                codigo: this.voluntarioLogado.idvoluntario,
                valorAbertura: parseFloat(valorAbertura)
            };

            if (observacao && observacao.trim() !== '') {
                caixaData.mensagem = observacao;
            }

            console.log('📤 Enviando dados para abertura:', caixaData);

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
            console.log('📥 Resposta da API:', resultado);

           if (resultado.codigo === 1) {
                this.caixaAberto = true;
                this.atualizarInterfaceStatus();
                this.mostrarNotificacao(resultado.mensagem, 'success', 'mensagensAbertura');
                this.limparFormulario();

                // ✅ SUBSTITUI O setTimeout POR:
                console.log('✅ Caixa aberto com sucesso! Mantendo usuário na mesma página.');
                
                // Opcional: Atualiza dados depois de 2 segundos
                setTimeout(() => {
                    this.buscarUltimoCaixa();
                }, 2000);

                return resultado;
            } else {
                throw new Error(resultado.mensagem || 'Erro desconhecido ao abrir caixa');
            }
        } catch (error) {
            console.error('Erro ao abrir caixa:', error);
            this.mostrarNotificacao(error.message, 'danger', 'mensagensAbertura');
            throw error;
        }
    }

    configurarEventListeners() {
        const btnAbrirCaixa = document.getElementById('btnAbrirCaixa');
        const valorAbertura = document.getElementById('valorAbertura');
        const formAbrirCaixa = document.getElementById('formAbrirCaixa');

        console.log('🔧 Configurando event listeners para abertura...');

        // Configurar input monetário
        this.configurarInputMonetario('valorAbertura');

        if (btnAbrirCaixa) {
            btnAbrirCaixa.addEventListener('click', () => {
                this.handleAbrirCaixa();
            });
        }

        if (valorAbertura) {
            valorAbertura.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAbrirCaixa();
                }
            });
        }

        if (formAbrirCaixa) {
            formAbrirCaixa.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAbrirCaixa();
            });
        }
    }

    async handleAbrirCaixa() {
        console.log('🎯 Iniciando processo de abertura de caixa...');

        const valorAberturaInput = document.getElementById('valorAbertura');
        const observacaoInput = document.getElementById('observacao');

        this.limparMensagens('mensagensAbertura');
        this.limparErroCampo('valorAbertura');

        if (!valorAberturaInput || !valorAberturaInput.value) {
            this.mostrarErroCampo('valorAbertura', 'Informe o valor de abertura!');
            this.mostrarMensagem('mensagensAbertura', 'É necessário informar um valor para abrir o caixa.', 'warning');
            if (valorAberturaInput) valorAberturaInput.focus();
            return;
        }

        const valorAbertura = this.parseMoeda(valorAberturaInput.value);
        console.log('💰 Valor de abertura parseado:', valorAbertura);

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

        valorAberturaInput.classList.add('is-valid');

        const btnAbrir = document.getElementById('btnAbrirCaixa');
        const originalText = btnAbrir.innerHTML;

        try {
            btnAbrir.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Abrindo...';
            btnAbrir.disabled = true;

            await this.abrirCaixa(valorAbertura, observacao);
        } catch (error) {
            console.error('Erro no handleAbrirCaixa:', error);
        } finally {
            btnAbrir.innerHTML = originalText;
            btnAbrir.disabled = false;
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

    atualizarInterfaceStatus() {
        super.atualizarInterfaceStatus();

        // Comportamento específico para abertura
        if (this.caixaAberto) {
            const btnAbrir = document.getElementById('btnAbrirCaixa');
            if (btnAbrir) {
                btnAbrir.disabled = true;
                btnAbrir.innerHTML = '<i class="fas fa-check me-2"></i>Caixa Já Aberto';
                this.mostrarMensagem('mensagensAbertura', 'Já existe um caixa aberto. Feche o caixa atual antes de abrir outro.', 'warning');
            }
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
}