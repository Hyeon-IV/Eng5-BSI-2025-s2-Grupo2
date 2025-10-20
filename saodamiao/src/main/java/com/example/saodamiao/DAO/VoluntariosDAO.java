package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Voluntarios;

import java.util.List;

public class VoluntariosDAO implements IDAO<Voluntarios> {

    @Override
    public boolean gravar(Voluntarios entidade) {
        return false;
    }

    @Override
    public boolean alterar(Voluntarios entidade, int id) {
        return false;
    }
    @Override
    public boolean apagar(Voluntarios entidade) {
        return false;
    }
    @Override
    public List<Voluntarios> pegarListaToda() {
        return List.of();
    }
}
