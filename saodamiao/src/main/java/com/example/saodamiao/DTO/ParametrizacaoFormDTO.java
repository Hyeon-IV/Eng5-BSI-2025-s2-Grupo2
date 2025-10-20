package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.Parametrizacao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParametrizacaoFormDTO {

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

    public Parametrizacao toParametrizacao()
    {
        Parametrizacao p = new Parametrizacao();
        p.setPar_cnpj(par_cnpj);
        p.setPar_razao_social(par_razao_social);
        p.setPar_nome_fantasia(par_nome_fantasia);
        p.setPar_site(par_site);
        p.setPar_email(par_email);
        p.setPar_telefone(par_telefone);
        p.setPar_contato(par_contato);
        p.setPar_rua(par_rua);
        p.setPar_bairro(par_bairro);
        p.setPar_cidade(par_cidade);
        p.setPar_uf(par_uf);
        p.setPar_cep(par_cep);
        p.setPar_logo_grande(par_logo_grande);
        p.setPar_logo_pequeno(par_logo_pequeno);
        return p;
    }
}
