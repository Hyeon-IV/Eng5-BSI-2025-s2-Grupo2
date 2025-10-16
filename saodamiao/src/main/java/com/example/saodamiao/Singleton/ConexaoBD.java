package com.example.saodamiao.Singleton;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBD {
    private static ConexaoBD instancia;
    private Connection conexao;

    private ConexaoBD(){
        try{
            conexao = DriverManager.getConnection("jdbc:mysql://localhost:3306/bazar", "root", "senha");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static ConexaoBD getInstacia(){
        if(instancia == null){
          instancia = new ConexaoBD();
        }
        return instancia;
    }

    public Connection getConexao() {
        return conexao;
    }
}
