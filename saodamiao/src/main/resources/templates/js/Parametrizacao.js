class Parametrizacao {

    constructor(data) {

        this.cnpj = data.par_cnpj;
        this.social = data.par_razao_social;
        this.fantasia = data.par_nome_fantasia;
        this.site = data.par_site;
        this.email = data.par_email;
        this.tel = data.par_telefone;
        this.contato = data.par_contato;
        this.rua = data.par_rua;
        this.bairro = data.par_bairro;
        this.cidade = data.par_cidade;
        this.uf = data.par_uf;
        this.cep = data.par_cep;
        this.logo_grande = data.par_logo_grande;
        this.logo_peq = data.par_logo_pequeno;
    }
}
async function carregarParametrizacao()
{
    const URl = 'http://localhost:8080/Parametrizacao/home';
    try{
        const response = await fetch(URl);
        const data = await response.json();
        console.log(data); // aqui to exibindo o objeto para fins de teste futuramente retirar

        if(response.status === 404 || response.status === 204){
            abrirCadastro();// implementar
            return;
        }
        let Parametros = new Parametrizacao(data);
        CarregarEmpresa(Parametros);
    }
    catch (error) {
        console.log("Erro fetching parametrizacao: ", error);
        abrirCadastro(); // implementar
    }
}

function CarregarEmpresa(Parametros)
{
    document.getElementById('img-logo').src = Parametros.logo_grande;
    document.getElementById('nome-ong').textContent = Parametros.fantasia;

}

function abrirCadastro()
{
    const url = new URL('/Parametrizacao/CadParametrizacao', window.location.origin);

}