package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.CaixaModel;
import com.example.saodamiao.Singleton.Conexao;

import java.sql.ResultSet;
import java.sql.SQLException;


public class CaixaDAO {

    private Conexao con;

    public CaixaDAO() {
        con = new Conexao();
        // Ajuste os parâmetros conforme o seu ambiente:
        con.conectar("jdbc:postgresql://localhost/", "bazar", "postgres", "1234");
    }

    public boolean atualizarValorCaixa(double novoValor, int idCaixa) {
        String sql = "UPDATE caixa SET valorfechamento = " + novoValor + " WHERE idcaixa = " + idCaixa;
        return con.manipular(sql);
    }

    public boolean caixaAberto(int idCaixa) {} //Fará a busca pra ver se tem caixa aberto, (tem que validar se o ID do caixa é o mesmo)

    public abrirCaixaBanco () {} //vai fazer a conexão com o banco enviando os dados de abertura

    public fecharCaixaBanco () {} //vai enviar os dados de fechamento (conferir se o ID do banco é o mesmo) e finalizar a conexao
}