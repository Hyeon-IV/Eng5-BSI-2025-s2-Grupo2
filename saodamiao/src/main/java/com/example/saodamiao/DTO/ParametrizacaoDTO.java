package com.example.saodamiao.DTO;


import com.example.saodamiao.Model.Parametrizacao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParametrizacaoDTO {

    private String par_razao_social, par_nome_fantasia, par_telefone, par_logo_grande,  par_logo_pequeno;

    public ParametrizacaoDTO (Parametrizacao p) {

        this.par_razao_social = p.getPar_razao_social();
        this.par_nome_fantasia = p.getPar_nome_fantasia();
        this.par_telefone = p.getPar_telefone();
        this.par_logo_grande = p.getPar_logo_grande();
        this.par_logo_pequeno = p.getPar_logo_pequeno();
    }

}