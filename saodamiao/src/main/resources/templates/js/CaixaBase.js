/**
 * Classe Base para Gerenciamento de Caixa
 * Contém métodos compartilhados entre abertura e fechamento
 */
class CaixaBase {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/caixa';
        this.voluntarioLogado = null;
        this.caixaAberto = null;
        console.log('✅ CaixaBase inicializada');
    }

    // ========== MÉTODOS COMPARTILHADOS ==========

    async carregarUsuarioLogado() {
        try {
            this.voluntarioLogado = {
                idvoluntario: 1,
                nome: "Administrador"
            };
            console.log('👤 Usuário logado:', this.voluntarioLogado);
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }

    async verificarStatusCaixa() {
        try {
            console.log('🔍 Verificando status do caixa...');
            const response = await fetch(`${this.baseURL}/status`);
            if (response.ok) {
                this.caixaAberto = await response.json();
                console.log('📊 Status do caixa:', this.caixaAberto);
                this.atualizarInterfaceStatus();
            } else {
                console.warn('Não foi possível verificar status do caixa');
                this.caixaAberto = false;
            }
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            this.caixaAberto = false;
        }
        return this.caixaAberto;
    }

    // ========== MÉTODOS DE INTERFACE ==========

    atualizarInterfaceStatus() {
        const statusElement = document.querySelector('.status-caixa');
        if (!statusElement) return;

        if (this.caixaAberto) {
            statusElement.innerHTML = '<span class="badge bg-success">Caixa Aberto</span>';
        } else {
            statusElement.innerHTML = '<span class="badge bg-warning">Caixa Fechado</span>';
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
        } else if (tipo === 'info') {
            classe = 'alert alert-info';
            icone = 'fas fa-info-circle';
        }

        container.innerHTML = `
            <div class="${classe} alert-dismissible fade show">
                <i class="${icone} me-2"></i>${mensagem}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        container.style.display = 'block';

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

    // ========== UTILITÁRIOS ==========

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatarMoeda(valor) {
        if (!valor && valor !== 0) return '0,00';
        return parseFloat(valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    parseMoeda(valorString) {
        if (!valorString) return 0;
        const valorLimpo = valorString.replace(/\./g, '').replace(',', '.');
        return parseFloat(valorLimpo) || 0;
    }

    formatarData(dataString) {
        try {
            if (!dataString) return 'N/A';
            const data = new Date(dataString);
            if (isNaN(data.getTime())) return dataString;
            return data.toLocaleString('pt-BR');
        } catch (error) {
            console.warn('Erro ao formatar data:', dataString, error);
            return dataString || 'N/A';
        }
    }

    mostrarNotificacao(mensagem, tipo, containerId) {
        console.log(`Notificação [${tipo}]:`, mensagem);

        if (containerId) {
            this.mostrarMensagem(containerId, mensagem, tipo);
        }

        if (typeof $.notify === 'function') {
            let icone = 'fas fa-info-circle';
            if (tipo === 'success') icone = 'fas fa-check';
            else if (tipo === 'warning') icone = 'fas fa-exclamation-triangle';
            else if (tipo === 'danger') icone = 'fas fa-times';

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

    configurarInputMonetario(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', (e) => {
            this.limparErroCampo(inputId);
            let value = e.target.value.replace(/\D/g, '');
            value = (value / 100).toFixed(2);
            if (value) {
                e.target.value = this.formatarMoeda(parseFloat(value));
                const valorNumerico = this.parseMoeda(e.target.value);
                if (valorNumerico > 0) {
                    e.target.classList.add('is-valid');
                }
            } else {
                e.target.value = '';
                e.target.classList.remove('is-valid');
            }
        });

        input.addEventListener('blur', (e) => {
            const valorNumerico = this.parseMoeda(e.target.value);
            if (valorNumerico <= 0 && e.target.value) {
                this.mostrarErroCampo(inputId, 'Valor deve ser maior que zero');
            }
        });
    }
}