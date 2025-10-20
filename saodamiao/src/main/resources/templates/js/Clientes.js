(function () {
    const CONTENT_ID = 'app-content';
    const ROUTE = 'clientes-bazar-create';   // rota do Cadastrar (via .js-route, se usar)
    const LIST_ROUTE = 'clientes-bazar-list'; // rota opcional do Listar (via .js-route)

    // Estado do formulário (para decidir se salva novo ou altera existente)
    let currentMode = 'create'; // 'create' | 'edit'
    let currentCpfAntigo = null;

    // Referência do DataTables para remover linha após exclusão
    let dataTableRef = null;

    const TEMPLATE = `
  <div class="form-shell">
    <div class="mb-3">
      <h3 class="mb-0" id="formTitle"><i class="fas fa-users me-2"></i>Bazar • Clientes • Cadastrar</h3>
    </div>

    <!-- Contêiner de alertas flutuantes -->
    <div id="formErrors" class="form-errors"></div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form id="formClienteBazar" name="cliente" class="needs-validation" novalidate>
          <div class="mb-3">
            <label for="nome" class="form-label">Nome completo</label>
            <input type="text" class="form-control form-control-lg" id="nome" name="nome" maxlength="40" required>
            <div class="invalid-feedback">Informe o nome (2 a 40 caracteres).</div>
          </div>

          <div class="mb-3">
            <label for="cpf" class="form-label">CPF</label>
            <input type="text" class="form-control form-control-lg" id="cpf" name="cpf" maxlength="14" required placeholder="000.000.000-00">
            <div class="invalid-feedback">Informe um CPF válido.</div>
          </div>

          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone</label>
            <input type="text" class="form-control form-control-lg" id="telefone" name="telefone" maxlength="15" required placeholder="(00) 00000-0000">
            <div class="invalid-feedback">Informe um telefone válido no formato (00) 00000-0000.</div>
          </div>

          <div class="mb-2">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" class="form-control form-control-lg" id="email" name="email" maxlength="40" required>
            <div class="invalid-feedback">Informe um e-mail válido.</div>
          </div>

          <div class="d-flex gap-2 mt-4 justify-content-center">
            <button type="submit" class="btn btn-success" id="submitBtn">
              <i class="fas fa-save me-2"></i>Salvar
            </button>
            <button type="reset" class="btn btn-outline-secondary">
              <i class="fas fa-eraser me-2"></i>Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>`;

    /** Monta o formulário centralizado (CADASTRAR) */
    function mountForm () {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;

        currentMode = 'create';
        currentCpfAntigo = null;

        content.classList.add('center-content');
        content.innerHTML = TEMPLATE;

        // Ajusta título/botão
        const title = document.getElementById('formTitle');
        const btn = document.getElementById('submitBtn');
        if (title) title.innerHTML = `<i class="fas fa-users me-2"></i>Bazar • Clientes • Cadastrar`;
        if (btn) btn.innerHTML = `<i class="fas fa-save me-2"></i>Salvar`;

        initMasksAndValidation();
        document.body.classList.remove('sidebar_minimize'); // opcional
    }

    /** Monta o formulário preenchido para EDIÇÃO */
    function mountEdit (cliente) {
        const content = document.getElementById(CONTENT_ID);
        if (!content || !cliente) return;

        currentMode = 'edit';
        currentCpfAntigo = onlyDigits(cliente.cpf); // manter sem máscara para o endpoint

        content.classList.add('center-content');
        content.innerHTML = TEMPLATE;

        // Título/botão
        const title = document.getElementById('formTitle');
        const btn = document.getElementById('submitBtn');
        if (title) title.innerHTML = `<i class="fas fa-user-edit me-2"></i>Bazar • Clientes • Editar`;
        if (btn) btn.innerHTML = `<i class="fas fa-save me-2"></i>Salvar alterações`;

        // Preenche campos com máscara “bonitinha”
        const nome = document.getElementById('nome');
        const cpf = document.getElementById('cpf');
        const tel = document.getElementById('telefone');
        const email = document.getElementById('email');

        if (nome)  nome.value  = cliente.nome ?? '';
        if (cpf)   cpf.value   = formatCPF(cliente.cpf ?? '');
        if (tel)   tel.value   = formatPhone(cliente.telefone ?? '');
        if (email) email.value = cliente.email ?? '';

        initMasksAndValidation(); // reaproveita validações + submit que respeita o currentMode
        document.body.classList.remove('sidebar_minimize');
    }

    /** (Opcional) desmonta */
    function unmountForm (message = 'Selecione uma opção no menu.') {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;
        content.classList.remove('center-content');
        content.innerHTML = `<div class="text-muted">${message}</div>`;
    }

    // ========= Helpers comuns =========
    function onlyDigits (s) { return String(s ?? '').replace(/\D/g, ''); }

    // Formatações para exibir bonitinho na LISTA/form
    function formatCPF(value) {
        const v = onlyDigits(value).slice(0, 11);
        if (!v) return '';
        if (v.length <= 3) return v;
        if (v.length <= 6) return v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
        if (v.length <= 9) return v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
        return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }
    function formatPhone(value) {
        const d = onlyDigits(value).slice(0, 11);
        if (!d) return '';
        if (d.length <= 2) return d;
        if (d.length <= 6) return d.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3'); // 11 dígitos
    }

    // CPF: valida dígitos verificadores
    function isValidCPF (value) {
        const cpf = onlyDigits(value);
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.substring(10, 11));
    }

    function isValidPhone (value) { return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test((value || '').trim()); }
    function isValidEmail (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value || '').trim()); }
    function setValid (input) { input.classList.remove('is-invalid'); input.classList.add('is-valid'); }
    function setInvalid (input) { input.classList.remove('is-valid'); input.classList.add('is-invalid'); }

    // Alerta flutuante vermelho (top-right)
    function showError (msg, idKey) {
        const box = document.getElementById('formErrors');
        if (!box) return;

        const key = idKey ? `err-${idKey}` : `err-${Date.now()}`;
        if (idKey && document.getElementById(key)) return;

        const alert = document.createElement('div');
        alert.className = 'alert alert-danger shadow-sm fade show mb-2';
        alert.id = key;
        alert.role = 'alert';
        alert.innerHTML = `
      <div class="d-flex align-items-start">
        <i class="fas fa-exclamation-triangle me-2 mt-1"></i>
        <div class="flex-grow-1">${msg}</div>
        <button type="button" class="btn-close ms-2" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
        box.appendChild(alert);

        setTimeout(() => {
            alert.classList.remove('show');
            alert.addEventListener('transitionend', () => alert.remove(), { once: true });
        }, 4000);
    }

    // Escapa HTML básico
    function esc(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // CSS injetado para a view de LISTA ficar mais larga e a busca maior (largura + altura)
    function ensureListStyles() {
        const styleId = 'clientes-list-wide-style';
        if (document.getElementById(styleId)) return;
        const st = document.createElement('style');
        st.id = styleId;
        st.textContent = `
      #app-content .form-shell.wide {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
      }
      @media (min-width: 1600px){
        #app-content .form-shell.wide { max-width: 90vw; }
      }

      /* Aumenta e estiliza o campo "Buscar registros" do DataTables */
      #tblClientes_wrapper .dataTables_filter label {
        display: flex;
        align-items: center;
        gap: .75rem;
      }
      #tblClientes_wrapper .dataTables_filter input,
      #tblClientes_wrapper .dataTables_filter input[type="search"],
      #tblClientes_wrapper .dataTables_filter .form-control {
        width: clamp(280px, 40vw, 560px);
        height: 48px !important;
        min-height: 48px !important;
        padding: .5rem 1rem !important;
        font-size: 1rem !important;
        line-height: 1.5 !important;
        border-radius: .5rem !important;
        box-sizing: border-box;
      }
    `;
        document.head.appendChild(st);
    }

    // ===== Envio real (fetch) — CADASTRAR =====
    function cadCliente() {
        const formUser = document.forms.cliente;
        const nome = formUser.nome.value.trim();
        const cpf  = onlyDigits(formUser.cpf.value.trim());
        const telefone = onlyDigits(formUser.telefone.value.trim());
        const email = formUser.email.value.trim();
        const payload = { nome, cpf, telefone, email };

        fetch("http://localhost:8080/apis/clientes/inserir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async (response) => {
                const contentType = response.headers.get('content-type') || '';
                const isJson = contentType.includes('application/json');
                const data = isJson ? await response.json().catch(() => null)
                    : await response.text().catch(() => '');
                if (!response.ok) {
                    const msg = (isJson && data && (data.mensagem || data.message))
                        ? (data.mensagem || data.message)
                        : (typeof data === 'string' ? data : '');
                    throw new Error(`${msg}`.trim());
                }
                return data;
            })
            .then((result) => {
                console.log("Cliente inserido com sucesso:", result);
                if (typeof swal === 'function') swal('Sucesso!', 'Cliente cadastrado com sucesso', 'success');
                formUser.reset();
                [formUser.nome, formUser.cpf, formUser.telefone, formUser.email]
                    .forEach(el => el.classList.remove('is-valid', 'is-invalid'));
                document.getElementById('formClienteBazar').classList.remove('was-validated');
            })
            .catch((error) => {
                console.error("Erro ao inserir cliente:", error);
                showError(`${error.message || ''}`);
            });
    }

    // ===== Envio real (fetch) — ALTERAR (PUT /alterar/{cpfAntigo}) =====
    function updateCliente(cpfAntigo) {
        const formUser = document.forms.cliente;
        const nome = formUser.nome.value.trim();
        const cpf  = onlyDigits(formUser.cpf.value.trim());       // novo CPF (pode mudar)
        const telefone = onlyDigits(formUser.telefone.value.trim());
        const email = formUser.email.value.trim();
        const payload = { nome, cpf, telefone, email };

        fetch(`http://localhost:8080/apis/clientes/alterar/${encodeURIComponent(onlyDigits(cpfAntigo))}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async (response) => {
                const contentType = response.headers.get('content-type') || '';
                const isJson = contentType.includes('application/json');
                const data = isJson ? await response.json().catch(() => null)
                    : await response.text().catch(() => '');
                if (!response.ok) {
                    const msg = (isJson && data && (data.mensagem || data.message))
                        ? (data.mensagem || data.message)
                        : (typeof data === 'string' ? data : '');
                    throw new Error(`${msg}`.trim());
                }
                return data;
            })
            .then((result) => {
                console.log("Cliente alterado com sucesso:", result);
                if (typeof swal === 'function') {
                    swal('Sucesso!', 'Cliente alterado com sucesso', 'success')
                        .then(() => mountList());
                } else {
                    alert('Cliente alterado com sucesso!');
                    mountList();
                }
            })
            .catch((error) => {
                console.error("Erro ao alterar cliente:", error);
                showError(`Falha ao alterar o cliente. ${error.message || ''}`);
            });
    }

    /** Máscaras + validação em tempo real + submit (create/edit) */
    function initMasksAndValidation () {
        const form = document.getElementById('formClienteBazar');
        if (!form) return;

        const nome = document.getElementById('nome');
        const cpf = document.getElementById('cpf');
        const tel = document.getElementById('telefone');
        const email = document.getElementById('email');

        cpf.addEventListener('input', () => {
            let v = onlyDigits(cpf.value).slice(0, 11);
            if (v.length > 9) cpf.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            else if (v.length > 6) cpf.value = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
            else if (v.length > 3) cpf.value = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');
            else cpf.value = v;
        });

        tel.addEventListener('input', () => {
            let v = onlyDigits(tel.value).slice(0, 11);
            if (v.length > 10) tel.value = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            else if (v.length > 6) tel.value = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            else if (v.length > 2) tel.value = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            else tel.value = v;
        });

        nome.addEventListener('input', () => {
            const ok = nome.value.trim().length >= 2 && nome.value.trim().length <= 40;
            ok ? setValid(nome) : setInvalid(nome);
        });
        nome.addEventListener('blur', () => {
            if (nome.value.trim().length < 2) showError('Nome muito curto (mínimo 2 caracteres).', 'nome');
        });

        cpf.addEventListener('input', () => {
            const val = cpf.value;
            if (onlyDigits(val).length < 11) { setInvalid(cpf); return; }
            isValidCPF(val) ? setValid(cpf) : setInvalid(cpf);
        });
        cpf.addEventListener('blur', () => {
            if (!isValidCPF(cpf.value)) showError('CPF inválido. Verifique os dígitos.', 'cpf');
        });

        tel.addEventListener('input', () => {
            isValidPhone(tel.value) ? setValid(tel) : setInvalid(tel);
        });
        tel.addEventListener('blur', () => {
            if (!isValidPhone(tel.value)) showError('Telefone inválido. Use o formato (00) 00000-0000.', 'telefone');
        });

        email.addEventListener('input', () => {
            isValidEmail(email.value) ? setValid(email) : setInvalid(email);
        });
        email.addEventListener('blur', () => {
            if (!isValidEmail(email.value)) showError('E-mail inválido.', 'email');
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const errors = [];
            if (!(nome.value.trim().length >= 2 && nome.value.trim().length <= 40)) { setInvalid(nome); errors.push('Nome inválido.'); }
            if (!isValidCPF(cpf.value)) { setInvalid(cpf); errors.push('CPF inválido.'); }
            if (!isValidPhone(tel.value)) { setInvalid(tel); errors.push('Telefone inválido.'); }
            if (!isValidEmail(email.value)) { setInvalid(email); errors.push('E-mail inválido.'); }

            if (errors.length) {
                errors.forEach((msg, i) => showError(msg, `submit-${i}`));
                form.classList.add('was-validated');
                return;
            }

            // Decide ação conforme o modo atual
            if (currentMode === 'edit' && currentCpfAntigo) {
                updateCliente(currentCpfAntigo);
            } else {
                cadCliente();
            }
        }, false);

        form.addEventListener('reset', () => {
            [nome, cpf, tel, email].forEach(el => el.classList.remove('is-valid', 'is-invalid'));
            form.classList.remove('was-validated');
        });
    }

    /* ================= LISTAR / CONSULTAR ================= */

    function mountList () {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;

        ensureListStyles();
        content.classList.remove('center-content');
        content.innerHTML = `
    <div class="form-shell wide">
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <h3 class="mb-0"><i class="fas fa-users me-2"></i>Bazar • Clientes • Lista</h3>
      </div>

      <div id="formErrors" class="form-errors"></div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div id="clientes-loading" class="text-center py-4">
            <div class="spinner-border" role="status" aria-hidden="true"></div>
            <div class="mt-2 text-muted">Carregando clientes...</div>
          </div>

          <div class="table-responsive d-none" id="clientes-table-wrap">
            <table class="table table-hover align-middle" id="tblClientes">
              <thead class="table-light">
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th style="width: 110px;">Ações</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

        </div>
      </div>
    </div>`;
        fetchClientesAndRender();
    }

    function fetchClientesAndRender() {
        fetch('http://localhost:8080/apis/clientes/pegalista', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`HTTP ${res.status} ${text}`);
                }
                return res.json();
            })
            .then((lista) => renderClientesTable(Array.isArray(lista) ? lista : []))
            .catch((err) => {
                console.error('Erro ao carregar clientes:', err);
                showError('Não foi possível carregar a lista de clientes. Tente novamente.');
                const l = document.getElementById('clientes-loading');
                if (l) l.classList.add('d-none');
            });
    }

    function renderClientesTable(clientes) {
        dataTableRef = null; // reset

        const loader = document.getElementById('clientes-loading');
        const wrap = document.getElementById('clientes-table-wrap');
        const tbody = document.querySelector('#tblClientes tbody');

        if (loader) loader.classList.add('d-none');
        if (!wrap || !tbody) return;

        if (!clientes.length) {
            wrap.innerHTML = `<div class="text-center text-muted py-4">Nenhum cliente encontrado.</div>`;
            wrap.classList.remove('d-none');
            return;
        }

        const rows = clientes.map(c => {
            const id = c.idCliente ?? c.id ?? '';
            const cpfRaw = onlyDigits(c.cpf); // sem máscara (para deletar/editar)
            const nome = esc(c.nome);
            const cpf = esc(formatCPF(c.cpf));
            const tel = esc(formatPhone(c.telefone));
            const email = esc(c.email);
            // guarda também dados crus nos data-attrs para usar no editar
            return `
        <tr data-id="${id}" data-cpf="${cpfRaw}" data-nome="${nome}" data-telefone="${onlyDigits(c.telefone)}" data-email="${email}">
          <td>${nome}</td>
          <td>${cpf}</td>
          <td>${tel}</td>
          <td>${email}</td>
          <td>
            <button class="btn btn-sm btn-primary me-1 js-edit" title="Editar"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger js-delete" title="Apagar"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>`;
        }).join('');

        tbody.innerHTML = rows;
        wrap.classList.remove('d-none');

        // Ações (editar) -> abre form pré-preenchido e usa PUT /alterar/{cpfAntigo}
        document.querySelectorAll('#tblClientes .js-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                if (!tr) return;
                const cliente = {
                    nome: tr.getAttribute('data-nome') || tr.children[0]?.textContent || '',
                    cpf: tr.getAttribute('data-cpf') || '',
                    telefone: tr.getAttribute('data-telefone') || '',
                    email: tr.getAttribute('data-email') || tr.children[3]?.textContent || ''
                };
                mountEdit(cliente);
            });
        });

        // Ações (apagar) -> chama DELETE /apis/clientes/deletar com { cpf }
        document.querySelectorAll('#tblClientes .js-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const tr = btn.closest('tr');
                const cpf = tr?.getAttribute('data-cpf'); // cpf sem máscara
                if (!cpf) return;

                const askConfirm = (onOk) => {
                    if (typeof swal === 'function') {
                        swal({
                            title: 'Confirmar exclusão?',
                            text: 'Você está prestes a apagar este cliente.',
                            icon: 'warning',
                            buttons: ['Cancelar', 'Apagar'],
                            dangerMode: true
                        }).then((willDelete) => { if (willDelete) onOk(); });
                    } else if (confirm('Confirmar exclusão do cliente?')) {
                        onOk();
                    }
                };

                const doDelete = () => {
                    fetch('http://localhost:8080/apis/clientes/deletar', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cpf })   // backend apaga por CPF
                    })
                        .then(async (res) => {
                            if (!res.ok) {
                                const txt = await res.text().catch(() => '');
                                throw new Error(`HTTP ${res.status} ${txt}`);
                            }
                            return res.json().catch(() => ({}));
                        })
                        .then(() => {
                            if (dataTableRef && typeof dataTableRef.row === 'function') {
                                dataTableRef.row(tr).remove().draw(false);
                            } else {
                                tr.remove();
                            }
                            if (typeof swal === 'function') swal('Pronto!', 'Cliente apagado com sucesso.', 'success');
                        })
                        .catch(err => {
                            console.error('Erro ao apagar cliente:', err);
                            showError('Falha ao apagar o cliente. Tente novamente.');
                        });
                };

                askConfirm(doDelete);
            });
        });

        // DataTables (se disponível)
        if (window.jQuery && jQuery.fn && typeof jQuery.fn.DataTable === 'function') {
            const dt = jQuery('#tblClientes').DataTable({
                pageLength: 10,
                autoWidth: false,
                order: [[0, 'asc']], // ordena por Nome
                language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json' }
            });
            dataTableRef = dt; // guarda referência global

            // Placeholder + altura maior no input de busca
            const $filterInput = jQuery('#tblClientes_filter input');
            if ($filterInput.length) {
                $filterInput
                    .attr('placeholder', 'Buscar registros')
                    .removeClass('form-control-sm')
                    .addClass('form-control form-control-lg');
            }
            setTimeout(() => dt.columns.adjust(), 0);
        }
    }

    /* ================= BINDS DE MENU ================= */

    function bindRoutes () {
        document
            .querySelectorAll(`.js-route[data-route="${ROUTE}"]`)
            .forEach(a => a.addEventListener('click', e => { e.preventDefault(); mountForm(); }));

        document
            .querySelectorAll(`.js-route[data-route="${LIST_ROUTE}"]`)
            .forEach(a => a.addEventListener('click', e => { e.preventDefault(); mountList(); }));

        document
            .querySelectorAll('a[href="clientes_bazar/list.html"]')
            .forEach(a => a.addEventListener('click', e => { e.preventDefault(); mountList(); }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindRoutes);
    } else {
        bindRoutes();
    }

    window.BazarClientes = {
        mount: () => { mountForm(); return false; },
        unmount: () => { unmountForm(); return false; },
        list: () => { mountList(); return false; }
    };
})();
