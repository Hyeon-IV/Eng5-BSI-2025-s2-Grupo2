/**
 * Carregador Dinâmico de Módulos de TipoBazar
 * Injeta conteúdo CRUD no app-content
 */
class TipoBazarLoader {
    constructor() {
        this.baseURL = 'http://localhost:8080/apis/tipobazar';
        this.init();
    }

    async init() {
        console.log('🚀 TipoBazarLoader inicializado');
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
            
            console.log('🔗 Link clicado (TipoBazar):', { href, modulo, acao });

            // Verifica se é um link do tipo bazar pelos atributos (PRIMEIRO HTML)
            if (modulo === 'tipo-bazar') {
                e.preventDefault();
                console.log(`📝 TipoBazar detectado: ${acao}`);
                
                switch(acao) {
                    case 'cadastrar':
                        this.carregarCadastro();
                        break;
                    case 'listar':
                        this.carregarListagem();
                        break;
                    case 'editar':
                        this.carregarEdicao();
                        break;
                    case 'excluir':
                        this.carregarExclusao();
                        break;
                }
                return;
            }

            // Também verifica pelo href como fallback (SEGUNDO HTML)
            if (href && href.includes('tipo-bazar')) {
                e.preventDefault();
                console.log(`📝 TipoBazar detectado pelo href: ${href}`);
                
                if (href.includes('create.html') || href.includes('cadastrar')) {
                    this.carregarCadastro();
                } else if (href.includes('list.html') || href.includes('listar')) {
                    this.carregarListagem();
                } else if (href.includes('edit.html') || href.includes('editar')) {
                    this.carregarEdicao();
                } else if (href.includes('delete.html') || href.includes('excluir')) {
                    this.carregarExclusao();
                }
            }
        });
    }

    // ========== MÓDULO DE CADASTRO ==========

    async carregarCadastro() {
        const html = `
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="page-title">Cadastrar Tipo de Bazar</h2>
                    <p class="text-muted">Adicione um novo tipo de item para o bazar</p>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-sm">
                        <div class="card-header bg-primary text-white">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-plus-circle me-2"></i>Novo Tipo de Bazar
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="mensagensCadastro" class="mb-3" style="display: none;"></div>

                            <form id="formCadastroTipoBazar">
                                <div class="mb-3">
                                    <label for="descricaoTipoBazar" class="form-label fw-bold">
                                        <i class="fas fa-tag me-1"></i>Descrição do Tipo *
                                    </label>
                                    <input type="text" 
                                           class="form-control form-control-lg" 
                                           id="descricaoTipoBazar"
                                           placeholder="Ex: Roupas, Calçados, Eletrônicos..."
                                           required
                                           maxlength="45">
                                    <div class="form-text">
                                        Descrição única para o tipo de item do bazar (máx. 45 caracteres)
                                    </div>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <button type="button" class="btn btn-secondary me-md-2" onclick="window.caixaLoader ? window.caixaLoader.carregarListagem() : location.reload()">
                                        <i class="fas fa-arrow-left me-2"></i>Voltar
                                    </button>
                                    <button type="submit" class="btn btn-success">
                                        <i class="fas fa-save me-2"></i>Cadastrar Tipo
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.injetarConteudo(html);
        this.configurarFormCadastro();
    }

    configurarFormCadastro() {
        const form = document.getElementById('formCadastroTipoBazar');
        const mensagens = document.getElementById('mensagensCadastro');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const descricao = document.getElementById('descricaoTipoBazar').value.trim();

            if (!descricao) {
                this.mostrarMensagem(mensagens, 'Por favor, informe a descrição do tipo.', 'warning');
                return;
            }

            try {
                const response = await fetch(`${this.baseURL}/inserir`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ desc: descricao })
                });

                if (response.ok) {
                    const resultado = await response.json();
                    this.mostrarMensagem(mensagens, 'Tipo de bazar cadastrado com sucesso!', 'success');
                    form.reset();

                    // Atualiza a listagem se estiver aberta
                    setTimeout(() => {
                        this.carregarListagem();
                    }, 2000);
                } else {
                    const erro = await response.json();
                    this.mostrarMensagem(mensagens, erro.mensagem || 'Erro ao cadastrar tipo de bazar', 'danger');
                }
            } catch (error) {
                console.error('Erro:', error);
                this.mostrarMensagem(mensagens, 'Erro de conexão. Tente novamente.', 'danger');
            }
        });
    }

    // ========== MÓDULO DE LISTAGEM ==========

    async carregarListagem() {
        const html = `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 class="page-title">Tipos de Bazar</h2>
                            <p class="text-muted">Gerencie os tipos de itens do bazar</p>
                        </div>
                        <button class="btn btn-primary" onclick="window.tipoBazarLoader.carregarCadastro()">
                            <i class="fas fa-plus me-2"></i>Novo Tipo
                        </button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-light">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-list me-2"></i>Lista de Tipos
                            </h4>
                        </div>
                        <div class="card-body">
                            <div id="mensagensListagem" class="mb-3" style="display: none;"></div>
                            <div id="loadingListagem" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Carregando...</span>
                                </div>
                                <p class="mt-2 mb-0 text-muted">Carregando tipos de bazar...</p>
                            </div>
                            <div id="tabelaTiposBazar" style="display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.injetarConteudo(html);
        this.carregarDadosListagem();
    }

    async carregarDadosListagem() {
        const loading = document.getElementById('loadingListagem');
        const tabela = document.getElementById('tabelaTiposBazar');
        const mensagens = document.getElementById('mensagensListagem');

        try {
            const response = await fetch(`${this.baseURL}/getall`);

            if (response.ok) {
                const tipos = await response.json();

                if (tipos.length === 0) {
                    tabela.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Nenhum tipo de bazar cadastrado. 
                            <a href="#" onclick="window.tipoBazarLoader.carregarCadastro()" class="alert-link">Clique aqui para cadastrar o primeiro tipo.</a>
                        </div>
                    `;
                } else {
                    let tabelaHTML = `
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th width="80">ID</th>
                                        <th>Descrição</th>
                                        <th width="150" class="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    tipos.forEach(tipo => {
                        tabelaHTML += `
                            <tr>
                                <td><strong>#${tipo.id}</strong></td>
                                <td>${this.escapeHtml(tipo.desc)}</td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn btn-outline-warning" onclick="window.tipoBazarLoader.carregarEdicao(${tipo.id})" title="Editar">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button type="button" class="btn btn-outline-danger" onclick="window.tipoBazarLoader.confirmarExclusao(${tipo.id}, '${this.escapeHtml(tipo.desc)}')" title="Excluir">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    });

                    tabelaHTML += `
                                </tbody>
                            </table>
                        </div>
                    `;

                    tabela.innerHTML = tabelaHTML;
                }

                loading.style.display = 'none';
                tabela.style.display = 'block';

            } else if (response.status === 204) {
                tabela.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Nenhum tipo de bazar cadastrado.
                    </div>
                `;
                loading.style.display = 'none';
                tabela.style.display = 'block';
            } else {
                throw new Error('Erro ao carregar dados');
            }

        } catch (error) {
            console.error('Erro:', error);
            loading.style.display = 'none';
            this.mostrarMensagem(mensagens, 'Erro ao carregar tipos de bazar.', 'danger');
        }
    }

    // ========== MÓDULO DE EDIÇÃO ==========

    async carregarEdicao(idTipo = null) {
        if (!idTipo) {
            // Modo de seleção para edição
            const html = `
                <div class="row mb-4">
                    <div class="col-12">
                        <h2 class="page-title">Editar Tipo de Bazar</h2>
                        <p class="text-muted">Selecione um tipo para editar</p>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-sm">
                            <div class="card-header bg-warning text-dark">
                                <h4 class="card-title mb-0">
                                    <i class="fas fa-edit me-2"></i>Selecionar Tipo para Editar
                                </h4>
                            </div>
                            <div class="card-body">
                                <div id="loadingEdicao" class="text-center py-4">
                                    <div class="spinner-border text-warning" role="status">
                                        <span class="visually-hidden">Carregando...</span>
                                    </div>
                                    <p class="mt-2 mb-0 text-muted">Carregando tipos...</p>
                                </div>
                                <div id="listaSelecaoEdicao" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.injetarConteudo(html);
            this.carregarListaSelecaoEdicao();
            return;
        }

        // Carrega formulário de edição específico
        await this.carregarFormEdicao(idTipo);
    }

    async carregarListaSelecaoEdicao() {
        const loading = document.getElementById('loadingEdicao');
        const lista = document.getElementById('listaSelecaoEdicao');

        try {
            const response = await fetch(`${this.baseURL}/getall`);

            if (response.ok) {
                const tipos = await response.json();

                if (tipos.length === 0) {
                    lista.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Nenhum tipo de bazar cadastrado para editar.
                        </div>
                    `;
                } else {
                    let listaHTML = '<div class="list-group">';

                    tipos.forEach(tipo => {
                        listaHTML += `
                            <a href="#" class="list-group-item list-group-item-action" onclick="window.tipoBazarLoader.carregarFormEdicao(${tipo.id})">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">${this.escapeHtml(tipo.desc)}</h5>
                                    <small>ID: #${tipo.id}</small>
                                </div>
                                <p class="mb-1">Clique para editar este tipo</p>
                            </a>
                        `;
                    });

                    listaHTML += '</div>';
                    lista.innerHTML = listaHTML;
                }

                loading.style.display = 'none';
                lista.style.display = 'block';

            } else {
                throw new Error('Erro ao carregar dados');
            }

        } catch (error) {
            console.error('Erro:', error);
            loading.style.display = 'none';
            lista.innerHTML = '<div class="alert alert-danger">Erro ao carregar tipos para edição.</div>';
            lista.style.display = 'block';
        }
    }

    async carregarFormEdicao(idTipo) {
        try {
            const response = await fetch(`${this.baseURL}/buscar/id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: idTipo })
            });

            if (response.ok) {
                const tipo = await response.json();

                const html = `
                    <div class="row mb-4">
                        <div class="col-12">
                            <h2 class="page-title">Editar Tipo de Bazar</h2>
                            <p class="text-muted">Modifique as informações do tipo selecionado</p>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-md-8 col-lg-6">
                            <div class="card shadow-sm">
                                <div class="card-header bg-warning text-dark">
                                    <h4 class="card-title mb-0">
                                        <i class="fas fa-edit me-2"></i>Editando Tipo #${tipo.id}
                                    </h4>
                                </div>
                                <div class="card-body">
                                    <div id="mensagensEdicao" class="mb-3" style="display: none;"></div>

                                    <form id="formEdicaoTipoBazar">
                                        <input type="hidden" id="idTipoBazar" value="${tipo.id}">
                                        
                                        <div class="mb-3">
                                            <label for="descricaoEdicaoTipoBazar" class="form-label fw-bold">
                                                <i class="fas fa-tag me-1"></i>Descrição do Tipo *
                                            </label>
                                            <input type="text" 
                                                   class="form-control form-control-lg" 
                                                   id="descricaoEdicaoTipoBazar"
                                                   value="${this.escapeHtml(tipo.desc)}"
                                                   required
                                                   maxlength="45">
                                            <div class="form-text">
                                                Descrição única para o tipo de item do bazar (máx. 45 caracteres)
                                            </div>
                                        </div>

                                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                            <button type="button" class="btn btn-secondary me-md-2" onclick="window.tipoBazarLoader.carregarListagem()">
                                                <i class="fas fa-arrow-left me-2"></i>Voltar
                                            </button>
                                            <button type="submit" class="btn btn-warning">
                                                <i class="fas fa-save me-2"></i>Atualizar Tipo
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                this.injetarConteudo(html);
                this.configurarFormEdicao();

            } else {
                this.carregarListagem();
                this.mostrarMensagemGlobal('Tipo não encontrado para edição.', 'warning');
            }

        } catch (error) {
            console.error('Erro:', error);
            this.carregarListagem();
            this.mostrarMensagemGlobal('Erro ao carregar tipo para edição.', 'danger');
        }
    }

    configurarFormEdicao() {
        const form = document.getElementById('formEdicaoTipoBazar');
        const mensagens = document.getElementById('mensagensEdicao');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('idTipoBazar').value;
            const descricao = document.getElementById('descricaoEdicaoTipoBazar').value.trim();

            if (!descricao) {
                this.mostrarMensagem(mensagens, 'Por favor, informe a descrição do tipo.', 'warning');
                return;
            }

            try {
                const response = await fetch(`${this.baseURL}/alterar`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: parseInt(id), desc: descricao })
                });

                if (response.ok) {
                    const resultado = await response.json();
                    this.mostrarMensagem(mensagens, 'Tipo de bazar atualizado com sucesso!', 'success');

                    setTimeout(() => {
                        this.carregarListagem();
                    }, 2000);
                } else {
                    const erro = await response.json();
                    this.mostrarMensagem(mensagens, erro.mensagem || 'Erro ao atualizar tipo de bazar', 'danger');
                }
            } catch (error) {
                console.error('Erro:', error);
                this.mostrarMensagem(mensagens, 'Erro de conexão. Tente novamente.', 'danger');
            }
        });
    }

    // ========== MÓDULO DE EXCLUSÃO ==========

    async carregarExclusao() {
        const html = `
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="page-title">Excluir Tipo de Bazar</h2>
                    <p class="text-muted">Selecione um tipo para excluir</p>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="card shadow-sm">
                        <div class="card-header bg-danger text-white">
                            <h4 class="card-title mb-0">
                                <i class="fas fa-trash me-2"></i>Selecionar Tipo para Excluir
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                <strong>Atenção:</strong> Esta ação não pode ser desfeita. Certifique-se da exclusão.
                            </div>
                            <div id="loadingExclusao" class="text-center py-4">
                                <div class="spinner-border text-danger" role="status">
                                    <span class="visually-hidden">Carregando...</span>
                                </div>
                                <p class="mt-2 mb-0 text-muted">Carregando tipos...</p>
                            </div>
                            <div id="listaSelecaoExclusao" style="display: none;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.injetarConteudo(html);
        this.carregarListaSelecaoExclusao();
    }

    async carregarListaSelecaoExclusao() {
        const loading = document.getElementById('loadingExclusao');
        const lista = document.getElementById('listaSelecaoExclusao');

        try {
            const response = await fetch(`${this.baseURL}/getall`);

            if (response.ok) {
                const tipos = await response.json();

                if (tipos.length === 0) {
                    lista.innerHTML = `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Nenhum tipo de bazar cadastrado para excluir.
                        </div>
                    `;
                } else {
                    let listaHTML = '<div class="list-group">';

                    tipos.forEach(tipo => {
                        listaHTML += `
                            <div class="list-group-item">
                                <div class="d-flex w-100 justify-content-between align-items-center">
                                    <div>
                                        <h5 class="mb-1">${this.escapeHtml(tipo.desc)}</h5>
                                        <small class="text-muted">ID: #${tipo.id}</small>
                                    </div>
                                    <button class="btn btn-outline-danger btn-sm" onclick="window.tipoBazarLoader.confirmarExclusao(${tipo.id}, '${this.escapeHtml(tipo.desc)}')">
                                        <i class="fas fa-trash me-1"></i>Excluir
                                    </button>
                                </div>
                            </div>
                        `;
                    });

                    listaHTML += '</div>';
                    lista.innerHTML = listaHTML;
                }

                loading.style.display = 'none';
                lista.style.display = 'block';

            } else {
                throw new Error('Erro ao carregar dados');
            }

        } catch (error) {
            console.error('Erro:', error);
            loading.style.display = 'none';
            lista.innerHTML = '<div class="alert alert-danger">Erro ao carregar tipos para exclusão.</div>';
            lista.style.display = 'block';
        }
    }

    async confirmarExclusao(id, descricao) {
        if (confirm(`Tem certeza que deseja excluir o tipo "${descricao}" (ID: #${id})? Esta ação não pode ser desfeita.`)) {
            try {
                const response = await fetch(`${this.baseURL}/deletar`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                });

                if (response.ok) {
                    this.mostrarMensagemGlobal('Tipo de bazar excluído com sucesso!', 'success');
                    this.carregarListagem();
                } else {
                    const erro = await response.json();
                    this.mostrarMensagemGlobal(erro.mensagem || 'Erro ao excluir tipo de bazar', 'danger');
                }
            } catch (error) {
                console.error('Erro:', error);
                this.mostrarMensagemGlobal('Erro de conexão. Tente novamente.', 'danger');
            }
        }
    }

    // ========== MÉTODOS UTILITÁRIOS ==========

    injetarConteudo(html) {
        const appContent = document.getElementById('app-content');
        if (appContent) {
            appContent.innerHTML = html;
            appContent.classList.remove('center-content');
            console.log('✅ Conteúdo do TipoBazar injetado no app-content');
        }
    }

    mostrarMensagem(container, mensagem, tipo) {
        if (container) {
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
        }
    }

    mostrarMensagemGlobal(mensagem, tipo) {
        const appContent = document.getElementById('app-content');
        if (appContent) {
            const mensagemDiv = document.createElement('div');
            mensagemDiv.className = `alert alert-${tipo === 'success' ? 'success' : tipo === 'warning' ? 'warning' : 'danger'} alert-dismissible fade show`;
            mensagemDiv.innerHTML = `
                <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'} me-2"></i>
                ${mensagem}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            appContent.insertBefore(mensagemDiv, appContent.firstChild);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.tipoBazarLoader = new TipoBazarLoader();
    console.log('🎯 TipoBazarLoader pronto - clique nos links do menu de Tipo de Bazar');
});