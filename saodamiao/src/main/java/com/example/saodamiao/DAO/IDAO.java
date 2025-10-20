package com.example.saodamiao.DAO;

import com.example.saodamiao.Singleton.Conexao;

import java.sql.*;
import java.sql.SQLException;
import java.util.List;

public interface IDAO <T>{

    public boolean gravar(T entidade, Conexao conexao);
    public boolean alterar(T entidade, int id, Conexao conexao) ;
    public boolean apagar(T entidade, Conexao conexao) ;
    public List<T> pegarListaToda(Conexao conexao);
}
