/**
 * Classe específica para Fechamento de Caixa
 * Herda de CaixaBase
 */
class FechamentoCaixa extends CaixaBase {
    constructor() {
        super();
        this.caixaAtual = null;
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando FechamentoCaixa...');
        await this.carregarUsuarioLogado();
        await this.buscarCaixaAberto();
        this.configurarEventListeners();
        this.iniciarAtualizacaoHora();
        console.log('✅ FechamentoCaixa inicializado com sucesso');
    }

    async buscarCaixaAberto() {
        try {
            console.log('🔍 Buscando caixa aberto...');
            const response = await fetch(`${this.baseURL}/aberto`);
            if (response.ok) {
                this.caixaAtual = await response.json();
                console.log('📦 Caixa atual:', this.caixaAtual);
                this.atualizarInterfaceCaixaAtual();

                // Atualiza status baseado no caixa atual
                this.caixaAberto = !!(this.caixaAtual && this.caixaAtual.idCaixa);
                this.atualizarInterfaceStatus();
            } else {
                console.warn('Nenhum caixa aberto encontrado');
                this.mostrarMensagem('mensagensFechamento', 'Nenhum caixa aberto encontrado para fechamento.', 'warning');
            }
        } catch (error) {
            console.error('Erro ao buscar caixa aberto:', error);
            this.mostrarMensagem('mensagensFechamento', 'Erro ao carregar dados do caixa atual.', 'danger');
        }
    }

    async fecharCaixa(valorFechamento) {
        try {
            if (!this.voluntarioLogado) {
                throw new Error('Nenhum voluntário logado');
            }

            if (!this.caixaAtual || !this.caixaAtual.idCaixa) {
                throw new Error('Nenhum caixa aberto encontrado');
            }

            const caixaData = {
                codigo: this.voluntarioLogado.idvoluntario,
                valorFechamento: parseFloat(valorFechamento)
            };

            console.log('📤 Enviando dados para fechamento:', caixaData);

            const response = await fetch(`${this.baseURL}/fechar`, {
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
                this.caixaAberto = false;
                this.atualizarInterfaceStatus();
                this.mostrarNotificacao(resultado.mensagem, 'success', 'mensagensFechamento');
                this.limparFormulario();

                // ✅ SUBSTITUI TODO O setTimeout POR:
                console.log('✅ Caixa fechado com sucesso! Mantendo usuário na mesma página.');
                
                // Opcional: Se quiser dar refresh na tela depois de 2 segundos:
                setTimeout(() => {
                    // Recarrega os dados atualizados (opcional)
                    this.buscarCaixaAberto(); 
                }, 2000);

                return resultado;
            } else {
                throw new Error(resultado.mensagem || 'Erro desconhecido ao fechar caixa');
            }
        } catch (error) {
            console.error('Erro ao fechar caixa:', error);
            this.mostrarNotificacao(error.message, 'danger', 'mensagensFechamento');
            throw error;
        }
    }

    configurarEventListeners() {
        const btnFecharCaixa = document.getElementById('btnFecharCaixa');
        const btnConferir = document.getElementById('btnConferir');
        const valorDinheiro = document.getElementById('valorDinheiro');
        const formFecharCaixa = document.getElementById('formFecharCaixa');

        console.log('🔧 Configurando event listeners para fechamento...');

        // Configurar input monetário
        this.configurarInputMonetario('valorDinheiro');

        if (btnFecharCaixa) {
            btnFecharCaixa.addEventListener('click', () => {
                this.handleFecharCaixa();
            });
        }

        if (btnConferir) {
            btnConferir.addEventListener('click', () => {
                this.handleConferirValores();
            });
        }

        if (valorDinheiro) {
            valorDinheiro.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleFecharCaixa();
                }
            });
        }

        if (formFecharCaixa) {
            formFecharCaixa.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFecharCaixa();
            });
        }
    }

    async handleFecharCaixa() {
        console.log('🎯 Iniciando processo de fechamento de caixa...');

        const valorDinheiroInput = document.getElementById('valorDinheiro');

        this.limparMensagens('mensagensFechamento');
        this.limparErroCampo('valorDinheiro');

        if (!valorDinheiroInput || !valorDinheiroInput.value) {
            this.mostrarErroCampo('valorDinheiro', 'Informe o valor em dinheiro!');
            this.mostrarMensagem('mensagensFechamento', 'É necessário informar o valor encontrado em dinheiro.', 'warning');
            if (valorDinheiroInput) valorDinheiroInput.focus();
            return;
        }

        const valorFechamento = this.parseMoeda(valorDinheiroInput.value);
        console.log('💰 Valor de fechamento parseado:', valorFechamento);

        if (valorFechamento <= 0) {
            this.mostrarErroCampo('valorDinheiro', 'O valor deve ser maior que zero!');
            this.mostrarMensagem('mensagensFechamento', 'O valor de fechamento deve ser maior que R$ 0,00.', 'warning');
            valorDinheiroInput.focus();
            return;
        }

        if (!this.caixaAberto) {
            this.mostrarMensagem('mensagensFechamento', 'Não há caixa aberto para fechar.', 'warning');
            return;
        }

        valorDinheiroInput.classList.add('is-valid');

        
        const btnFechar = document.getElementById('btnFecharCaixa');
        const originalText = btnFechar.innerHTML;

        try {
            btnFechar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Fechando...';
            btnFechar.disabled = true;

            await this.fecharCaixa(valorFechamento);
        } catch (error) {
            console.error('Erro no handleFecharCaixa:', error);
        } finally {
            btnFechar.innerHTML = originalText;
            btnFechar.disabled = false;
        }
    }

    handleConferirValores() {
        const valorDinheiroInput = document.getElementById('valorDinheiro');

        if (!valorDinheiroInput || !valorDinheiroInput.value) {
            this.mostrarMensagem('mensagensFechamento', 'Informe o valor em dinheiro para conferir.', 'warning');
            return;
        }

        const valorDinheiro = this.parseMoeda(valorDinheiroInput.value);

        this.mostrarMensagem('mensagensFechamento',
            `Valor conferido: R$ ${this.formatarMoeda(valorDinheiro)}. Verifique se está correto antes de fechar.`,
            'info'
        );

        // Habilita o botão de fechar após conferência
        const btnFechar = document.getElementById('btnFecharCaixa');
        if (btnFechar) {
            btnFechar.disabled = false;
        }
    }

    atualizarInterfaceCaixaAtual() {
        const container = document.getElementById('info-caixa-atual');
        if (!container) {
            console.error('Container info-caixa-atual não encontrado!');
            return;
        }

        console.log('🔄 Atualizando interface caixa atual:', this.caixaAtual);

        if (!this.caixaAtual) {
            container.innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i>Dados do caixa não carregados.</div>';
            return;
        }

        if (this.caixaAtual.codigo === -2 || this.caixaAtual.mensagem?.includes('Nenhum caixa aberto')) {
            container.innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle me-2"></i>Nenhum caixa aberto encontrado.</div>';
            return;
        }

        // Usa o ID independente do caso (idCaixa ou idcaixa)
        const idCaixa = this.caixaAtual.idCaixa || this.caixaAtual.idcaixa;
        const valorAbertura = this.caixaAtual.valorAbertura || 0;
        const dataAbertura = this.caixaAtual.dataAbertura;
        const codigo = this.caixaAtual.codigo;

        const html = `
            <div class="text-center">
                <h4 class="text-success mb-3">
                    <i class="fas fa-cash-register me-2"></i>Caixa #${idCaixa}
                </h4>
                <div class="row">
                    <div class="col-12">
                        <small class="text-muted d-block">Valor de Abertura:</small>
                        <strong class="text-success fs-4">R$ ${this.formatarMoeda(valorAbertura)}</strong>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <small class="text-muted d-block">Data de Abertura:</small>
                        <strong>${this.formatarData(dataAbertura)}</strong>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <small class="text-muted d-block">Responsável:</small>
                        <strong>Voluntário #${codigo}</strong>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        console.log('✅ Interface do caixa atual atualizada');
    }

    atualizarInterfaceStatus() {
        super.atualizarInterfaceStatus();

        // Comportamento específico para fechamento
        if (!this.caixaAberto) {
            this.mostrarMensagem('mensagensFechamento', 'Não há caixa aberto para fechar.', 'warning');
            const btnFechar = document.getElementById('btnFecharCaixa');
            if (btnFechar) {
                btnFechar.disabled = true;
            }
        }
    }

    limparFormulario() {
        const valorDinheiro = document.getElementById('valorDinheiro');
        if (valorDinheiro) {
            valorDinheiro.value = '';
            valorDinheiro.classList.remove('is-valid');
        }
        this.limparMensagens('mensagensFechamento');
    }
}