// ../js/pages/clientes-bazar.js
(function () {
    const CONTENT_ID = 'app-content';
    const ROUTE = 'clientes-bazar-create';

    const TEMPLATE = `
    <div class="form-shell">
      <div class="mb-3">
        <h3 class="mb-0"><i class="fas fa-users me-2"></i>Bazar • Clientes • Cadastrar</h3>
      </div>

      <!-- Contêiner de alertas flutuantes -->
      <div id="formErrors" class="form-errors"></div>

      <div class="card shadow-sm">
        <div class="card-body">
          <form id="formClienteBazar" class="needs-validation" novalidate>
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
              <button type="submit" class="btn btn-success">
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

    /** Monta o formulário centralizado */
    function mountForm () {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;

        content.classList.add('center-content'); // centraliza
        content.innerHTML = TEMPLATE;

        initMasksAndValidation();
        document.body.classList.remove('sidebar_minimize'); // opcional: fecha menu no mobile
    }

    /** (Opcional) desmonta */
    function unmountForm (message = 'Selecione uma opção no menu.') {
        const content = document.getElementById(CONTENT_ID);
        if (!content) return;
        content.classList.remove('center-content');
        content.innerHTML = `<div class="text-muted">${message}</div>`;
    }

    // ========= Helpers de validação =========

    function onlyDigits (s) { return (s || '').replace(/\D/g, ''); }

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

    function isValidPhone (value) {
        // Aceita (00) 0000-0000 ou (00) 00000-0000
        return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(value.trim());
    }

    function isValidEmail (value) {
        // simples e robusto o suficiente para UI
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    }

    function setValid (input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    function setInvalid (input) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }

    // Alerta flutuante vermelho (top-right)
    function showError (msg, idKey) {
        const box = document.getElementById('formErrors');
        if (!box) return;

        // Evita empilhar mensagens idênticas (por campo)
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
      </div>
    `;
        box.appendChild(alert);

        // some depois de 4s
        setTimeout(() => {
            alert.classList.remove('show');
            alert.addEventListener('transitionend', () => alert.remove(), { once: true });
        }, 4000);
    }

    /** Máscaras + validação em tempo real + submit */
    function initMasksAndValidation () {
        const form = document.getElementById('formClienteBazar');
        if (!form) return;

        const nome = document.getElementById('nome');
        const cpf = document.getElementById('cpf');
        const tel = document.getElementById('telefone');
        const email = document.getElementById('email');

        // ===== Máscaras =====
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

        // ===== Validações em tempo real (input/blur) =====
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

        // ===== Submit =====
        form.addEventListener('submit', function (event) {
            const errors = [];

            if (!(nome.value.trim().length >= 2 && nome.value.trim().length <= 40)) {
                setInvalid(nome); errors.push('Nome inválido.');
            }
            if (!isValidCPF(cpf.value)) {
                setInvalid(cpf); errors.push('CPF inválido.');
            }
            if (!isValidPhone(tel.value)) {
                setInvalid(tel); errors.push('Telefone inválido.');
            }
            if (!isValidEmail(email.value)) {
                setInvalid(email); errors.push('E-mail inválido.');
            }

            if (errors.length) {
                event.preventDefault();
                event.stopPropagation();
                // Mostra um resumo (pode mostrar vários alerts, 1 por erro)
                errors.forEach((msg, i) => showError(msg, `submit-${i}`));
                form.classList.add('was-validated');
                return;
            }

            // OK: submeter (simulado)
            event.preventDefault();
            const data = Object.fromEntries(new FormData(form).entries());
            console.log('Cliente salvo (simulado):', data);
            if (typeof swal === 'function') {
                swal('Sucesso!', 'Cliente cadastrado com sucesso', 'success');
            }
            form.reset();
            [nome, cpf, tel, email].forEach(el => el.classList.remove('is-valid', 'is-invalid'));
            form.classList.remove('was-validated');
        }, false);

        // Reset limpa feedback visual
        form.addEventListener('reset', () => {
            [nome, cpf, tel, email].forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        });
    }

    /** Liga o clique do menu ao mountForm */
    function bindRoutes () {
        document
            .querySelectorAll(`.js-route[data-route="${ROUTE}"]`)
            .forEach(a => a.addEventListener('click', e => { e.preventDefault(); mountForm(); }));
    }

    // Inicializa
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindRoutes);
    } else {
        bindRoutes();
    }
    window.BazarClientes = {
        mount: mountForm,
        unmount: unmountForm
    };
})();
