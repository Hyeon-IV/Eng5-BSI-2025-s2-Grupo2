package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Beneficiarios;

import java.util.List;

public class BeneficiariosDAO implements IDAO<Beneficiarios> {

    @Override
    public boolean gravar(Beneficiarios beneficiarios) {
        return false;
    }
    @Override
    public boolean alterar(Beneficiarios beneficiarios, int id) {
        return false;
    }
    @Override
    public boolean apagar(Beneficiarios entidade) {
        return false;
    }

    @Override
    public List<Beneficiarios> pegarListaToda() {
        return List.of();
    }
}
