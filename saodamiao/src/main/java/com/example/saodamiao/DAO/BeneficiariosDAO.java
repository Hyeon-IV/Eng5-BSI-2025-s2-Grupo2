package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Beneficiarios;
import com.example.saodamiao.Singleton.Conexao;

import java.util.List;

public class BeneficiariosDAO implements IDAO<Beneficiarios> {

    @Override
    public boolean gravar(Beneficiarios beneficiarios, Conexao conexao) {
        return false;
    }
    @Override
    public boolean alterar(Beneficiarios beneficiarios, int id, Conexao conexao) {
        return false;
    }
    @Override
    public boolean apagar(Beneficiarios entidade, Conexao conexao) {
        return false;
    }

    @Override
    public List<Beneficiarios> pegarListaToda(Conexao conexao) {
        return List.of();
    }
}
