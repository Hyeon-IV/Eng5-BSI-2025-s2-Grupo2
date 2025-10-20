package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Model.TipoAlimento;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlimentoDTO {
    private String nome;
    private String tipo_alimento;


    public void toDTO(Alimento alimento, TipoAlimento tipo_alimento){
        this.nome = alimento.getNome();
        this.tipo_alimento = tipo_alimento.getNome();
    }

    public  Alimento toAlimento(){
        TipoAlimento tipoAlimento = new TipoAlimento();
        tipoAlimento = tipoAlimento.getTipoAlimentoDAO().ResgatarTipo(tipo_alimento);

        Alimento alimento = new Alimento(this.nome,tipoAlimento.getId());

        return alimento;
    }
}
