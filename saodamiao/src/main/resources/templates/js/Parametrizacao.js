class ParametrizacaoDTO {

    constructor(data) {

        this.social = data.par_razao_social;
        this.fantasia = data.par_nome_fantasia;
        this.email = data.par_email;
        this.logo_grande = data.par_logo_grande;
        this.logo_pequeno = data.logo_pequeno;
    }
}
async function carregarParametrizacao() {
    const URL = 'http://localhost:8080/Parametrizacao/home';

    try {
        const response = await fetch(URL, {
            headers: { 'Accept': 'application/json' } });
        // Se não existir ou não tiver conteúdo → abre cadastro
        if (response.status === 404 || response.status === 204) {
            abrirCadastro();
            return;
        }
        // Qualquer outro erro HTTP (400, 500, etc.)
        if (!response.ok) {
            const msg = await response.text().catch(() => '');
            abrirCadastro();
            return;
        }
        // Agora sim, parseia JSON
        const data = await response.json();
        const Parametros = new ParametrizacaoDTO(data);
        CarregarEmpresa(Parametros);

    } catch (error) {
        console.log('Erro fetching parametrizacao:', error);
        abrirCadastro(); // falha de rede/CORS/etc.
    }
}

function CarregarEmpresa(Parametros)
{
    document.getElementById('img-logo').src = Parametros.logo_grande;
    document.getElementById('nome-ong').textContent = Parametros.fantasia;

}

function abrirCadastro()
{
    const CONTENT_ID = 'app-content';

    // cria o container caso não exista
    let host = document.getElementById(CONTENT_ID);
    if (!host) {
        host = document.createElement('div');
        host.id = CONTENT_ID;
        document.body.appendChild(host);
    }

    const TEMPLATE = `
<div class="container min-vh-100 d-flex justify-content-center align-items-center">
  <div class="w-100" style="max-width: 720px;">
    <div class="form-shell">
      <div class="mb-3 text-center">
        <h3 class="mb-0"><i class="fas fa-users me-2"></i>Cadastro da ONG</h3>
      </div>

      <div id="formErrors" class="form-errors"></div>

      <div class="card shadow-sm">
        <div class="card-body">
          <form id="formParametrizacao" class="needs-validation" novalidate>
            <!-- CNPJ -->
            <div class="mb-3">
              <label for="par_cnpj" class="form-label">CNPJ</label>
              <input type="text" class="form-control form-control-lg" id="par_cnpj" name="par_cnpj"
                     maxlength="18" required placeholder="00.000.000/0000-00">
              <div class="invalid-feedback">Informe o CNPJ (18 caracteres).</div>
            </div>

            <!-- Razão Social -->
            <div class="mb-3">
              <label for="par_razao_social" class="form-label">Razão Social</label>
              <input type="text" class="form-control form-control-lg" id="par_razao_social" name="par_razao_social"
                     maxlength="60" required>
              <div class="invalid-feedback">Informe entre 3 e 60 caracteres.</div>
            </div>

            <!-- Nome Fantasia -->
            <div class="mb-3">
              <label for="par_nome_fantasia" class="form-label">Nome Fantasia</label>
              <input type="text" class="form-control form-control-lg" id="par_nome_fantasia" name="par_nome_fantasia"
                     maxlength="45" required>
              <div class="invalid-feedback">Informe entre 3 e 45 caracteres.</div>
            </div>

            <!-- Site -->
            <div class="mb-3">
              <label for="par_site" class="form-label">Site</label>
              <input type="url" class="form-control form-control-lg" id="par_site" name="par_site"
                     maxlength="120" placeholder="https://meusite.com.br">
              <div class="invalid-feedback">Informe uma URL válida (https://...).</div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label for="par_email" class="form-label">E-mail</label>
              <input type="email" class="form-control form-control-lg" id="par_email" name="par_email"
                     maxlength="60" required>
              <div class="invalid-feedback">Informe um e-mail válido.</div>
            </div>

            <!-- Telefone -->
            <div class="mb-3">
              <label for="par_telefone" class="form-label">Telefone</label>
              <input type="text" class="form-control form-control-lg" id="par_telefone" name="par_telefone"
                     maxlength="15" required placeholder="(00) 00000-0000">
              <div class="invalid-feedback">Formato (00) 00000-0000.</div>
            </div>

            <!-- Contato alternativo -->
            <div class="mb-3">
              <label for="par_contato" class="form-label">Outro Contato</label>
              <input type="text" class="form-control form-control-lg" id="par_contato" name="par_contato"
                     maxlength="15" placeholder="(00) 00000-0000">
              <div class="invalid-feedback">Formato (00) 00000-0000.</div>
            </div>

            <!-- Endereço -->
            <div class="mb-3">
              <label for="par_rua" class="form-label">Rua</label>
              <input type="text" class="form-control form-control-lg" id="par_rua" name="par_rua"
                     maxlength="45" required>
              <div class="invalid-feedback">Informe entre 3 e 45 caracteres.</div>
            </div>

            <div class="mb-3">
              <label for="par_bairro" class="form-label">Bairro</label>
              <input type="text" class="form-control form-control-lg" id="par_bairro" name="par_bairro"
                     maxlength="45" required>
              <div class="invalid-feedback">Informe entre 3 e 45 caracteres.</div>
            </div>

            <div class="mb-3">
              <label for="par_cidade" class="form-label">Cidade</label>
              <input type="text" class="form-control form-control-lg" id="par_cidade" name="par_cidade"
                     maxlength="45" required>
              <div class="invalid-feedback">Informe entre 3 e 45 caracteres.</div>
            </div>

            <div class="mb-3">
              <label for="par_uf" class="form-label">UF</label>
              <input type="text" class="form-control form-control-lg" id="par_uf" name="par_uf"
                     maxlength="2" required pattern="^[A-Za-z]{2}$" placeholder="SP">
              <div class="invalid-feedback">Informe a UF com 2 letras (ex.: SP).</div>
            </div>

            <div class="mb-3">
              <label for="par_cep" class="form-label">CEP</label>
              <input type="text" class="form-control form-control-lg" id="par_cep" name="par_cep"
                     maxlength="9" required inputmode="numeric" pattern="^\\d{5}-\\d{3}$" placeholder="00000-000">
              <div class="invalid-feedback">Formato 00000-000.</div>
            </div>

            <!-- Logos -->
            <div class="mb-3">
              <label for="par_logo_grande" class="form-label">Logo grande (URL ou caminho)</label>
              <input type="text" class="form-control form-control-lg" id="par_logo_grande" name="par_logo_grande"
                     maxlength="255" required placeholder="EXE: /uploads/logo-grande.png ou https://...">
              <div class="invalid-feedback">Informe uma URL http/https ou caminho iniciado com “/”.</div>
            </div>

            <div class="mb-3">
              <label for="par_logo_pequeno" class="form-label">Logo pequeno (URL ou caminho)</label>
              <input type="text" class="form-control form-control-lg" id="par_logo_pequeno" name="par_logo_pequeno"
                     maxlength="255" required placeholder="EXE: /uploads/logo-pequeno.png ou https://...">
              <div class="invalid-feedback">Informe uma URL http/https ou caminho iniciado com “/”.</div>
            </div>

            <!-- Botões -->
            <div class="d-flex gap-2 mt-4 justify-content-center">
              <button type="submit" class="btn btn-success px-4" id="btnConfirmar">Confirmar</button>
              <button type="button" class="btn btn-outline-secondary px-4" id="btnCancelar">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>`;
    host.innerHTML = TEMPLATE;

    (function SalvarParametrizacao() {
        const btn   = document.getElementById('btnConfirmar');
        const form  = document.getElementById('formParametrizacao');
        const erros = document.getElementById('formErrors');
        if (!btn || !form) return;

        // Cancelar
        const btnCancelar = document.getElementById('btnCancelar');
        if (btnCancelar) btnCancelar.addEventListener('click', () => form.reset());

        // Máscaras (ids corretos com par_)
        const uf = document.getElementById('par_uf');
        if (uf) uf.addEventListener('input', () => {
            uf.value = uf.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
        });
        const cep = document.getElementById('par_cep');
        if (cep) cep.addEventListener('input', () => {
            let v = cep.value.replace(/\D/g, '').slice(0, 8);
            cep.value = v.length > 5 ? v.slice(0,5) + '-' + v.slice(5) : v;
        });
        ['par_telefone','par_contato'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                let v = el.value.replace(/\D/g, '').slice(0, 11);
                if (v.length > 10) el.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
                else if (v.length > 6) el.value = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
                else if (v.length > 2) el.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
                else el.value = v;
            });
        });

        // Clique no confirmar
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            const dto = {
                par_cnpj:          document.getElementById('par_cnpj').value.trim(),
                par_razao_social:  document.getElementById('par_razao_social').value,
                par_nome_fantasia: document.getElementById('par_nome_fantasia').value,
                par_site:          document.getElementById('par_site').value,
                par_email:         document.getElementById('par_email').value,
                par_telefone:      document.getElementById('par_telefone').value,
                par_contato:       document.getElementById('par_contato').value,
                par_rua:           document.getElementById('par_rua').value,
                par_bairro:        document.getElementById('par_bairro').value,
                par_cidade:        document.getElementById('par_cidade').value,
                par_uf:            document.getElementById('par_uf').value.toLowerCase(),
                par_cep:           document.getElementById('par_cep').value,
                par_logo_grande:   document.getElementById('par_logo_grande').value,
                par_logo_pequeno:  document.getElementById('par_logo_pequeno').value
            };

            const msgs = [];
            if (!/^[A-Za-z]{2}$/.test(dto.par_uf))   msgs.push('UF inválida.');
            if (!/^\d{5}-\d{3}$/.test(dto.par_cep))  msgs.push('CEP inválido.');
            if (dto.par_razao_social.length < 3)     msgs.push('Razão Social muito curta.');
            if (dto.par_nome_fantasia.length < 3)    msgs.push('Nome Fantasia muito curto.');
            if (msgs.length) { showErrors(msgs); return; }

            toggleLoading(true);
            try {
                console.log(dto);
                const resp = await fetch('http://localhost:8080/Parametrizacao/inserir', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(dto)
                });

                if (!resp.ok) {
                    const msg = await readBody(resp);
                    showErrors([`Erro ao salvar (${resp.status}): ${msg}`]);
                    return;
                }
                const saved = await safeJson(resp).catch(() => dto);
                alert('Parametrização salva com sucesso!');
                form.reset();
            } catch (err) {
                showErrors(['Sem conexão com o servidor.']);
                console.error(err);
            } finally {
                toggleLoading(false);
            }
        });

        // helpers
        function showErrors(list){
            if (!erros) { alert(list.join('\n')); return; }
            erros.innerHTML = list.map(m => `<div class="alert alert-danger mb-2">${escapeHtml(m)}</div>`).join('');
        }
        function toggleLoading(on){
            if (!btn) return;
            if (on) {
                btn.disabled = true;
                btn.dataset._old = btn.innerHTML;
                btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Salvando...`;
            } else {
                btn.disabled = false;
                if (btn.dataset._old) btn.innerHTML = btn.dataset._old;
            }
        }
        async function readBody(resp){
            const ct = resp.headers.get('content-type') || '';
            try{
                if (ct.includes('application/json')) {
                    const j = await resp.json();
                    return j?.mensagem || j?.error || JSON.stringify(j);
                }
                return await resp.text();
            } catch { return ''; }
        }
        async function safeJson(resp){ return resp.json(); }
        function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])); }
    })();
}
