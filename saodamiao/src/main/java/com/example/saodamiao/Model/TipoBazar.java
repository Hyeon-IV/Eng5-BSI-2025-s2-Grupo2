package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.TipoAlimentoDAO;
import com.example.saodamiao.DAO.TipoBazarDAO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TipoBazar {
    private int id;
    private String desc;

    TipoBazarDAO tipoBazarDAO;

    public TipoBazar(int id, String desc) {
        this.id = id;
        this.desc = desc;
        this.tipoBazarDAO = new TipoBazarDAO();
    }

    public TipoBazar() {
        this.tipoBazarDAO = new TipoBazarDAO();
    }
}
