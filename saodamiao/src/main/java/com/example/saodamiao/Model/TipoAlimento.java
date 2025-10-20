package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.TipoAlimentoDAO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TipoAlimento {
    private long id;
    private String nome;
    TipoAlimentoDAO tipoAlimentoDAO;
    public TipoAlimento(long id, String nome){
        this.id = id;
        this.nome = nome;
        this.tipoAlimentoDAO = new TipoAlimentoDAO();
    }
    public TipoAlimento(){
        this.tipoAlimentoDAO = new TipoAlimentoDAO();
    }
}
