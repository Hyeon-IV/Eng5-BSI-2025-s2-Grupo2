// bazar.js

class GerenciadorBazar {
    constructor() {
        this.urlBase = '/apis/tipobazar'; // ✅ Corrigido - sem localhost
        this.inicializar();
    }

    inicializar() {
        this.vincularEventos();
        this.carregarConteudoInicial();
    }

    vincularEventos() {
        // Vincular eventos do menu
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const acao = e.target.getAttribute('data-action');
                this.manipularAcaoMenu(acao);
            });
        });
    }

    carregarConteudoInicial() {
        // Carrega conteúdo inicial
        this.mostrarListarTipos();
    }

    manipularAcaoMenu(acao) {
        switch(acao) {
            case 'cadastrar-tipo':
                this.mostrarCadastrarTipo();
                break;
            case 'listar-tipos':
                this.mostrarListarTipos();
                break;
            case 'editar-tipo':
                this.mostrarEditarTipo();
                break;
            case 'excluir-tipo':
                this.mostrarExcluirTipo();
                break;
            default:
                console.log('Ação não reconhecida:', acao);
        }
    }

    mostrarCadastrarTipo() {
        const conteudo = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Cadastrar Tipo de Bazar</h3>
                            </div>
                            <div class="card-body">
                                <form id="form-cadastrar-tipo">
                                    <div class="mb-3">
                                        <label for="descricao" class="form-label">Descrição</label>
                                        <input type="text" class="form-control" id="descricao" name="descricao" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.atualizarConteudo(conteudo);
        this.vincularFormCadastrar();
    }

    mostrarListarTipos() {
        const conteudo = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Lista de Tipos de Bazar</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Descrição</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabela-tipos">
                                            <tr>
                                                <td colspan="3" class="text-center">Carregando...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.atualizarConteudo(conteudo);
        this.carregarListaTipos();
    }

    mostrarEditarTipo() {
        const conteudo = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Editar Tipo de Bazar</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="selecionar-tipo" class="form-label">Selecione o Tipo</label>
                                    <select class="form-control" id="selecionar-tipo">
                                        <option value="">Carregando tipos...</option>
                                    </select>
                                </div>
                                <form id="form-editar-tipo" style="display: none;">
                                    <div class="mb-3">
                                        <label for="nova-descricao" class="form-label">Nova Descrição</label>
                                        <input type="text" class="form-control" id="nova-descricao" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary">Atualizar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.atualizarConteudo(conteudo);
        this.carregarSelecaoTipos();
    }

    mostrarExcluirTipo() {
        const conteudo = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Excluir Tipo de Bazar</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label for="selecionar-excluir" class="form-label">Selecione o Tipo para Excluir</label>
                                    <select class="form-control" id="selecionar-excluir">
                                        <option value="">Carregando tipos...</option>
                                    </select>
                                </div>
                                <button id="botao-excluir" class="btn btn-danger" disabled>Excluir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.atualizarConteudo(conteudo);
        this.carregarSelecaoExcluir();
    }

    atualizarConteudo(html) {
        const conteudoApp = document.querySelector('.app-content');
        if (conteudoApp) {
            conteudoApp.innerHTML = html;
        }
    }

    // Métodos para API
    async carregarListaTipos() {
        try {
            const resposta = await fetch(`${this.urlBase}/getall`);
            if (resposta.ok) {
                const tipos = await resposta.json();
                this.preencherTabelaTipos(tipos);
            } else {
                this.mostrarErro('Erro ao carregar tipos');
            }
        } catch (erro) {
            this.mostrarErro('Erro de conexão');
        }
    }

    preencherTabelaTipos(tipos) {
        const corpoTabela = document.getElementById('tabela-tipos');
        if (tipos && tipos.length > 0) {
            corpoTabela.innerHTML = tipos.map(tipo => `
                <tr>
                    <td>${tipo.id}</td>
                    <td>${tipo.desc}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="gerenciadorBazar.editarTipo(${tipo.id}, '${tipo.desc}')">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="gerenciadorBazar.excluirTipo(${tipo.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            corpoTabela.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum tipo cadastrado</td></tr>';
        }
    }

    vincularFormCadastrar() {
        const formulario = document.getElementById('form-cadastrar-tipo');
        if (formulario) {
            formulario.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.cadastrarTipo();
            });
        }
    }

    async cadastrarTipo() {
        const descricao = document.getElementById('descricao').value;

        try {
            const resposta = await fetch(`${this.urlBase}/inserir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ desc: descricao })
            });

            if (resposta.ok) {
                this.mostrarSucesso('Tipo cadastrado com sucesso!');
                document.getElementById('form-cadastrar-tipo').reset();
                this.mostrarListarTipos(); // Volta para a lista
            } else {
                this.mostrarErro('Erro ao cadastrar tipo');
            }
        } catch (erro) {
            this.mostrarErro('Erro de conexão');
        }
    }

    async carregarSelecaoTipos() {
        try {
            const resposta = await fetch(`${this.urlBase}/getall`);
            if (resposta.ok) {
                const tipos = await resposta.json();
                const selecao = document.getElementById('selecionar-tipo');
                selecao.innerHTML = '<option value="">Selecione um tipo</option>' +
                    tipos.map(tipo => `<option value="${tipo.id}" data-desc="${tipo.desc}">${tipo.desc}</option>`).join('');

                selecao.addEventListener('change', (e) => {
                    const opcaoSelecionada = e.target.options[e.target.selectedIndex];
                    if (opcaoSelecionada.value) {
                        document.getElementById('form-editar-tipo').style.display = 'block';
                        document.getElementById('nova-descricao').value = opcaoSelecionada.getAttribute('data-desc');
                        this.vincularFormEditar(opcaoSelecionada.value);
                    }
                });
            }
        } catch (erro) {
            this.mostrarErro('Erro ao carregar tipos');
        }
    }

    vincularFormEditar(id) {
        const formulario = document.getElementById('form-editar-tipo');
        if (formulario) {
            formulario.onsubmit = async (e) => {
                e.preventDefault();
                await this.atualizarTipo(id);
            };
        }
    }

    async atualizarTipo(id) {
        const novaDescricao = document.getElementById('nova-descricao').value;

        try {
            const resposta = await fetch(`${this.urlBase}/alterar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    desc: novaDescricao
                })
            });

            if (resposta.ok) {
                this.mostrarSucesso('Tipo atualizado com sucesso!');
                this.mostrarListarTipos();
            } else {
                this.mostrarErro('Erro ao atualizar tipo');
            }
        } catch (erro) {
            this.mostrarErro('Erro de conexão');
        }
    }

    async carregarSelecaoExcluir() {
        try {
            const resposta = await fetch(`${this.urlBase}/getall`);
            if (resposta.ok) {
                const tipos = await resposta.json();
                const selecao = document.getElementById('selecionar-excluir');
                selecao.innerHTML = '<option value="">Selecione um tipo para excluir</option>' +
                    tipos.map(tipo => `<option value="${tipo.id}">${tipo.desc}</option>`).join('');

                selecao.addEventListener('change', (e) => {
                    document.getElementById('botao-excluir').disabled = !e.target.value;
                });

                document.getElementById('botao-excluir').addEventListener('click', async () => {
                    const id = selecao.value;
                    if (id && confirm('Tem certeza que deseja excluir este tipo?')) {
                        await this.executarExclusaoTipo(id);
                    }
                });
            }
        } catch (erro) {
            this.mostrarErro('Erro ao carregar tipos');
        }
    }

    async executarExclusaoTipo(id) {
        try {
            const resposta = await fetch(`${this.urlBase}/deletar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });

            if (resposta.ok) {
                this.mostrarSucesso('Tipo excluído com sucesso!');
                this.mostrarListarTipos();
            } else {
                this.mostrarErro('Erro ao excluir tipo');
            }
        } catch (erro) {
            this.mostrarErro('Erro de conexão');
        }
    }

    editarTipo(id, descricao) {
        this.mostrarEditarTipo();
        // Aguarda um pouco para o DOM ser atualizado
        setTimeout(() => {
            const selecao = document.getElementById('selecionar-tipo');
            if (selecao) {
                selecao.value = id;
                const evento = new Event('change');
                selecao.dispatchEvent(evento);
            }
        }, 100);
    }

    async excluirTipo(id) {
        if (confirm('Tem certeza que deseja excluir este tipo?')) {
            await this.executarExclusaoTipo(id);
        }
    }

    mostrarSucesso(mensagem) {
        alert('Sucesso: ' + mensagem);
    }

    mostrarErro(mensagem) {
        alert('Erro: ' + mensagem);
    }
}

// Inicializa o gerenciador
const gerenciadorBazar = new GerenciadorBazar();