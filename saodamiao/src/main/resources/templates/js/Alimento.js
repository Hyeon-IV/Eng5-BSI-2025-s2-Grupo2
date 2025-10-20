
document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('cadastro-alimento');
    const view = document.getElementById('app-content');




    const telaCadastro = `
<section class="container py-4 min-vh-100 d-flex align-items-center">
  <div class="row justify-content-center w-100">
    <div class="col-12 col-lg-8 col-xl-6">
      <div class="card shadow-sm">
        <div class="card-header bg-body-tertiary">
          <h3 class="h5 mb-0"><i class="fas fa-users me-2"></i>Cesta • Alimentos • Cadastrar</h3>
        </div>

        <div class="card-body">
          <form id="formAlimento" class="row g-3 needs-validation" novalidate>
            <div class="col-12">
              <label for="nome" class="form-label">Nome do Alimento</label>
              <input type="text" class="form-control form-control-lg" id="nome-alim" name="nome" maxlength="40" placeholder="Ex.: Arroz" required>
              <div class="invalid-feedback">Informe o nome do alimento.</div>
            </div>

           
            <div class="col-12 col-md-6">
              <label for="tipo_alimento" class="form-label">Tipo de Alimento</label>
             
             <select id ="tipos-list" class="form-select" aria-label="Selecione um item" required>
              <option value="" selected disabled>Escolha um item…</option>
            </select>
              <div class="invalid-feedback">Escolha um tipo válido.</div>
            </div>

            <div class="col-12 d-grid d-sm-flex gap-2 justify-content-sm-end mt-2">
              <button type="reset" class="btn btn-outline-secondary">Limpar</button>
              <button type="submit" class="btn btn-success"><i class="fas fa-save me-2"></i>Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
`;
    const tipos =  async function () {
        const response = await fetch('http://localhost:8080/apis/tipoalimento/getall');
        const data = await response.json();
        return data;
    }

    const inserirTipos = async function () {
        const dl = document.getElementById('tipos-list');
        if (!dl) return;


        const lista = await tipos();
        for (const item of lista) {
            const opt = document.createElement('option');
            opt.value = item.nome;
            opt.textContent = item.nome;
            dl.appendChild(opt);
        }



    };
    
    


    link.addEventListener('click', (e) => {
        e.preventDefault();
        view.innerHTML = telaCadastro;
        inserirTipos();
        const form = document.getElementById('formAlimento');



        //adicionando o post
        form.addEventListener('submit', async (ev)=>{
            ev.preventDefault();
            ev.stopPropagation();

            //validação do proprio bootstrap
            form.classList.add('was-validated');
            if (!form.checkValidity()) return;

            const retorno = { // salvando os valores para enviar
                'nome' : document.getElementById('nome-alim').value.trim(),
                'tipo_alimento' : document.getElementById('tipos-list').value
            }

            try{
                const resp = await fetch('http://localhost:8080/apis/alimentos/inserir',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(retorno)
                })

                if (!resp.ok) {
                    const msg = await resp.text(); // lê uma vez só
                    throw new Error(msg);
                }


                swal('Sucesso!', 'Alimento cadastrado com sucesso', 'success');

                form.reset();
                form.classList.remove('was-validated');

            }catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                swal('Erro!', `Alimento não foi cadastrado: ${msg}`, 'error');
            }
        })

    });
});


