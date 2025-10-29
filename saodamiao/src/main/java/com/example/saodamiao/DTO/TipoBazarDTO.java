package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.TipoBazar;
import java.util.ArrayList;
import java.util.List;

public class TipoBazarDTO {
    private int id;
    private String desc;

    // GETTERS AND SETTERS
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<TipoBazarDTO> listToDTO(List<TipoBazar> lista) {
        List<TipoBazarDTO> listaDTO = new ArrayList<>();
        for (TipoBazar tipoBazar : lista) {
            TipoBazarDTO dto = new TipoBazarDTO();
            dto.setId(tipoBazar.getId());
            dto.setDesc(tipoBazar.getDesc());
            listaDTO.add(dto);
        }
        return listaDTO;
    }
}