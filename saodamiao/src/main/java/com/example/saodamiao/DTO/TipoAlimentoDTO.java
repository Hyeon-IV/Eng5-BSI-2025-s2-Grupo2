package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.TipoAlimento;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TipoAlimentoDTO {
    private String nome;


    public TipoAlimentoDTO() {

    }
    public  TipoAlimentoDTO(String nome) {
        this.nome = nome;
    }

    public List<TipoAlimentoDTO> listToDTO(List<TipoAlimento> t1){
        List<TipoAlimentoDTO> list = new ArrayList<>();
        for(TipoAlimento t : t1){
            list.add(new TipoAlimentoDTO(t.getNome()));
        }
        return list;
    }
}
