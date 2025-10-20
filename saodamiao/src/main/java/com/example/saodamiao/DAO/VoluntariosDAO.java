package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Voluntarios;
import com.example.saodamiao.Singleton.Conexao;

import java.util.List;

public class VoluntariosDAO implements IDAO<Voluntarios> {

    @Override
    public boolean gravar(Voluntarios entidade, Conexao conexao) {
        return false;
    }

    @Override
    public boolean alterar(Voluntarios entidade, int id, Conexao conexao) {
        return false;
    }
    @Override
    public boolean apagar(Voluntarios entidade, Conexao conexao) {
        return false;
    }
    @Override
    public List<Voluntarios> pegarListaToda(Conexao conexao) {
        return List.of();
    }
}
