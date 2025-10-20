package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Singleton.Singleton;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
        tipoAlimento = tipoAlimento.getTipoAlimentoDAO().ResgatarTipo(tipo_alimento, Singleton.Retorna());

        Alimento alimento = new Alimento(this.nome,tipoAlimento.getId());

        return alimento;
    }

    public List<AlimentoDTO> toArrayDTO(List<Alimento> alimentos){
        List<AlimentoDTO> alimentosDTO = new ArrayList<>();
        AlimentoDTO alimentoDTO;
        TipoAlimento tipoAlimento = new TipoAlimento();

        for(Alimento alimento : alimentos){
            tipoAlimento = tipoAlimento.getTipoAlimentoDAO().ResgatarTipo(alimento.getTipo_alimento_id(), Singleton.Retorna());
            alimentosDTO.add(
                    new AlimentoDTO(alimento.getNome(), tipoAlimento.getNome())
            );
        }
        return alimentosDTO;

    }
}
