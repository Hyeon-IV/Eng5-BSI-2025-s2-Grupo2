package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.ParametrizacaoDAO;

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

    // get and sets
    public ParametrizacaoDAO getParametrizacaoDAO() {
        return parametrizacaoDAO;
    }

    public void setParametrizacaoDAO(ParametrizacaoDAO parametrizacaoDAO) {
        this.parametrizacaoDAO = parametrizacaoDAO;
    }
    public String getPar_cnpj() {
        return par_cnpj;
    }

    public void setPar_cnpj(String par_cnpj) {
        this.par_cnpj = par_cnpj;
    }
    public String getPar_razao_social() { return par_razao_social; }

    public void setPar_razao_social(String par_razao_social) {
        this.par_razao_social = par_razao_social;
    }

    public String getPar_nome_fantasia() {
        return par_nome_fantasia;
    }

    public void setPar_nome_fantasia(String par_nome_fantasia) {
        this.par_nome_fantasia = par_nome_fantasia;
    }

    public String getPar_site() {
        return par_site;
    }

    public void setPar_site(String par_site) {
        this.par_site = par_site;
    }

    public String getPar_email() {
        return par_email;
    }

    public void setPar_email(String par_email) {
        this.par_email = par_email;
    }

    public String getPar_telefone() {
        return par_telefone;
    }

    public void setPar_telefone(String par_telefone) {
        this.par_telefone = par_telefone;
    }

    public String getPar_contato() {
        return par_contato;
    }

    public void setPar_contato(String par_contato) {
        this.par_contato = par_contato;
    }

    public String getPar_rua() {
        return par_rua;
    }

    public void setPar_rua(String par_rua) {
        this.par_rua = par_rua;
    }

    public String getPar_bairro() {
        return par_bairro;
    }

    public void setPar_bairro(String par_bairro) {
        this.par_bairro = par_bairro;
    }

    public String getPar_cidade() {
        return par_cidade;
    }

    public void setPar_cidade(String par_cidade) {
        this.par_cidade = par_cidade;
    }

    public String getPar_uf() {
        return par_uf;
    }

    public void setPar_uf(String par_uf) {
        this.par_uf = par_uf;
    }

    public String getPar_cep() {
        return par_cep;
    }

    public void setPar_cep(String par_cep) {
        this.par_cep = par_cep;
    }

    public String getPar_logo_grande() {
        return par_logo_grande;
    }

    public void setPar_logo_grande(String par_logo_grande) {
        this.par_logo_grande = par_logo_grande;
    }

    public String getPar_logo_pequeno() {
        return par_logo_pequeno;
    }

    public void setPar_logo_pequeno(String par_logo_pequeno) {
        this.par_logo_pequeno = par_logo_pequeno;
    }
}
