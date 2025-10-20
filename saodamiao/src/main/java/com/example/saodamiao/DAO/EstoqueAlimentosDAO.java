package com.example.saodamiao.DAO;


import com.example.saodamiao.Model.EstoqueAlimentos;
import com.example.saodamiao.Singleton.Conexao;

import java.sql.ResultSet;
import java.sql.SQLException;

public class EstoqueAlimentosDAO {
    private Conexao con;

    public EstoqueAlimentosDAO(){
        con = new Conexao();
        con.conectar("jdbc:postgresql://localhost/", "bazar", "postgres", "1234");
    }

    public boolean atualizarEstoqueAlimentos(int qtde, int id){
        String sql = "UPDATE estoque_alimento SET esa_qtde = " + qtde + " WHERE alimentos_idalimentos = " + id;
        return con.manipular(sql);
    }
}
