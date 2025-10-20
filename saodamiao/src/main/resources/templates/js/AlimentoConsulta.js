const tam_pagina = 6;
const estado_pag = {
    dados : [],
    pagina_atual: 0,
    qtd_max_pag : 0
}
document.addEventListener('DOMContentLoaded',()=>{
    const link = document.getElementById('consultar-alimento');
    const main = document.getElementById('app-content');

const telaConsulta= `
<section class="container py-4 min-vh-100 d-flex align-items-center">
  <div class="row justify-content-center w-100">
    <div class="col-12 col-lg-10 col-xl-9">
      <div class="card shadow-sm w-100">
        <div class="card-header bg-body-tertiary d-flex align-items-center justify-content-between">
          <h3 class="h5 mb-0"><i class="fas fa-users me-2"></i>Cesta • Alimentos • Consultar</h3>
          <!-- espaço para ações futuras (ex.: adicionar) -->
        </div>

        <div class="card-body">
          <!-- Filtro -->
          <form id="formFiltro" class="row g-3 align-items-end">
            <div class="col-12 col-md-8">
              <label for="filtro-nome" class="form-label">Filtrar por nome ou tipo</label>
              <input type="text" id="filtro-nome" class="form-control form-control-lg" 
                     placeholder="Digite para filtrar… (ex.: Arroz, Grão, Laticínio)">
            </div>
            <div class="col-12 col-md-4 d-grid">
              <button type="button" id="btn-limpar-filtro" class="btn btn-outline-secondary">
                Limpar filtro
              </button>
            </div>
          </form>

          <!-- Tabela -->
          <div class="table-responsive mt-4">
            <table id="tabela-alimentos" class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th scope="col" style="width: 45%">Nome</th>
                  <th scope="col" style="width: 45%">Tipo de Alimento</th>
                  <th scope="col" class="text-end" style="width: 10%">Ações</th>
                </tr>
              </thead>
              <tbody id="lista-alimentos">              
              </tbody>
            </table>
          </div>

          <!-- Rodapé opcional (paginação futura) -->
          <div id="paginacao-alimentos" class="d-flex justify-content-end gap-2 mt-2 d-none">
            <button class="btn btn-sm btn-outline-secondary" data-pagina="prev">Anterior</button>
            <button class="btn btn-sm btn-outline-secondary" data-pagina="next">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
`;

    const alimentos = async function(){
        const response = await fetch('http://localhost:8080/apis/alimentos/getall');
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    }

    async function insereAlimentosTabela() {
        const table = document.getElementById('lista-alimentos');

        try {
            const conteudo = await alimentos();

            const data = Array.isArray(conteudo) ? conteudo :
                (Array.isArray(conteudo?.content) ? conteudo.content : []);

            estado_pag.dados = data;
            estado_pag.qtd_max_pag = Math.ceil(data.length / tam_pagina);
            if (!data.length) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 99;
                td.textContent = 'Nenhum alimento encontrado.';
                td.className = 'text-center py-4';
                tr.appendChild(td);
                table.appendChild(tr);
                return;
            }


            let nav = document.createElement('nav');
            nav.id = 'paginacao';

            const tabela = document.getElementById('lista-alimentos')?.closest('table');
            ;
            (tabela?.parentElement || document.body).appendChild(nav);

            nav.innerHTML = '';

            const btn = (label, target) => {
                const b = document.createElement('button');
                b.type = 'button';
                b.textContent = label;
                b.disabled = false;
                b.className = 'px-3 py-1 border rounded mx-1';
                if (target) {
                    b.onclick = () => {
                        if (estado_pag.pagina_atual + 1 < estado_pag.qtd_max_pag) {
                            estado_pag.pagina_atual++;
                            carregarPagina();
                        }
                    }

                } else {
                    b.onclick = () => {
                        if (estado_pag.pagina_atual - 1 >= 0) {
                            estado_pag.pagina_atual--;
                            carregarPagina();
                        }
                    }
                }
                return b;
            }
            nav.appendChild(btn('«', false));
            const span = document.createElement('span');
            span.textContent = `Página ${estado_pag.pagina_atual + 1} de ${estado_pag.qtd_max_pag + 1}`;
            span.className = 'mx-2';
            span.id = 'qtd-pagina';
            nav.appendChild(span);
            nav.appendChild(btn('»', true));
            carregarPagina();


        } catch (err) {
            console.error(err);
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 99;
            td.textContent = `Erro ao carregar: ${err.message || err}`;
            td.className = 'text-center py-4';
            tr.appendChild(td);
            table.appendChild(tr);
        }


        function carregarPagina() {
            const table = document.getElementById('lista-alimentos');

            while (table.firstChild) table.removeChild(table.firstChild);

            const colunas = ['nome', 'tipo_alimento'];

            let pos = estado_pag.pagina_atual * tam_pagina; // indice de 0...x
            let aux = pos;
            for (; pos < aux + tam_pagina; pos++) {
                let cont = estado_pag.dados[pos];
                if(cont == null)
                    break;
                const tr = document.createElement('tr');
                colunas.forEach(cols => {
                    const td = document.createElement('td');
                    const cnt = cont?.[cols];
                    td.textContent = cnt == null ? "" : cnt;
                    tr.appendChild(td);
                })
                const divaux = document.createElement('div');
                const td = document.createElement('td');
                const buttonAlterar = criarBotaoAlterar(pos);
                const buttonApagar = criarBotaoExcluir(pos);
                divaux.appendChild(buttonAlterar);
                divaux.appendChild(buttonApagar);
                divaux.className = 'd-flex align-items-center gap-2';
                td.appendChild(divaux);

                tr.appendChild(td);

                table.appendChild(tr);
            }
            const span = document.getElementById('qtd-pagina');
            span.textContent = `Página ${estado_pag.pagina_atual + 1} de ${estado_pag.qtd_max_pag}`;

        }
    }

    function criarBotaoAlterar(id) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary btn-sm alterar-btn';
        btn.dataset.id = String(id);

        const icon = document.createElement('i');
        icon.className = 'bi bi-pencil me-1';

        btn.appendChild(icon);
        return btn;
    }

    function criarBotaoExcluir(id) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-danger btn-sm excluir-btn red';
        btn.dataset.id = String(id);

        const icon = document.createElement('i');
        icon.className = 'bi bi-trash me-1';

        btn.appendChild(icon);
        return btn;
    }

    link.addEventListener('click', (e) => {
        e.preventDefault();
        main.innerHTML = telaConsulta;
        insereAlimentosTabela();
    })

});