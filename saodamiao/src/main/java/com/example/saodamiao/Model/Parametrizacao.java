package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.ParametrizacaoDAO;
import lombok.Data;

@Data
public class Parametrizacao {

    private String par_cnpj;
    private String par_razao_social;
    private String par_nome_fantasia;
    private String par_site;
    private String par_email;
    private String par_telefone;
    private String par_contato;
    private String par_rua;
    private String par_bairro;
    private String par_cidade;
    private String par_uf;
    private String par_cep;
    private String par_logo_grande;
    private String par_logo_pequeno;
    private ParametrizacaoDAO  parametrizacaoDAO;

    //construtor
    public Parametrizacao(){
        this.parametrizacaoDAO = new ParametrizacaoDAO();
    }

    public Parametrizacao(String par_cnpj, String par_telefone, String par_razao_social) {
        this.par_cnpj = par_cnpj;
        this.par_telefone = par_telefone;
        this.par_razao_social = par_razao_social;
    }

    public Parametrizacao(String par_cnpj, String par_razao_social, String par_nome_fantasia, String par_site, String par_email, String par_telefone, String par_contato, String par_rua, String par_bairro, String par_cidade, String par_uf, String par_cep, String par_logo_grande, String par_logo_pequeno) {
        this.par_cnpj = par_cnpj;
        this.par_razao_social = par_razao_social;
        this.par_nome_fantasia = par_nome_fantasia;
        this.par_site = par_site;
        this.par_email = par_email;
        this.par_telefone = par_telefone;
        this.par_contato = par_contato;
        this.par_rua = par_rua;
        this.par_bairro = par_bairro;
        this.par_cidade = par_cidade;
        this.par_uf = par_uf;
        this.par_cep = par_cep;
        this.par_logo_grande = par_logo_grande;
        this.par_logo_pequeno = par_logo_pequeno;
        this.parametrizacaoDAO = new ParametrizacaoDAO();
    }
}
