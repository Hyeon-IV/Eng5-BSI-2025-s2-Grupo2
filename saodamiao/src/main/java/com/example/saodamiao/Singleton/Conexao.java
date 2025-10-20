package com.example.saodamiao.Singleton;

import java.sql.*;

public class Conexao {

    private Connection connect;
    private String erro;

    public Conexao() {
        erro = "";
        connect = null;
    }

    public boolean conectar(String local, String banco, String usuario, String senha) {
        boolean conectado = false;
        try {
            String url = local + banco; // "jdbc:postgresql://localhost/"+banco;
            connect = DriverManager.getConnection(url, usuario, senha);
            connect.setAutoCommit(true);
            conectado = true;
        } catch (SQLException sqlex) {
            erro = "Impossivel conectar com a base de dados: " + sqlex.toString();
        } catch (Exception ex) {
            erro = "Outro erro: " + ex.toString();
        }
        return conectado;
    }

    public String getMensagemErro() { return erro; }

    public boolean getEstadoConexao() {
        try {
            return connect.isClosed();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // inserir, alterar, excluir
    public boolean manipular(String sql) {
        boolean executou = false;
        try (Statement statement = connect.createStatement()) {   // fecha statement
            int result = statement.executeUpdate(sql);
            if (result >= 1) executou = true;
        } catch (SQLException sqlex) {
            erro = "Erro: " + sqlex.toString();
        }
        return executou;
    }

    public ResultSet consultar(String sql) {
        ResultSet rs = null;
        try {
            Statement statement = connect.createStatement();
            statement.closeOnCompletion();                        // fecha quando rs fechar
            rs = statement.executeQuery(sql);
        } catch (SQLException sqlex) {
            erro = "Erro: " + sqlex.toString();
            rs = null;
        }
        return rs;
    }

    public int getMaxPK(String tabela, String chave) {
        String sql = "select max(" + chave + ") from " + tabela;
        int max = 0;
        ResultSet rs = consultar(sql);
        try {
            if (rs != null && rs.next())
                max = rs.getInt(1);
        } catch (SQLException sqlex) {
            erro = "Erro: " + sqlex.toString();
            max = -1;
        }
        return max;
    }

    public boolean Rollback() {
        try {
            connect.rollback();
            return true;
        } catch (SQLException sqlex) {
            erro = "Erro: " + sqlex.toString();
            return false;
        } finally {

            try { connect.setAutoCommit(true); } catch (SQLException ignore) {}
        }
    }

    public boolean StartTransaction() {
        try {

            if (!connect.getAutoCommit()) {
                try { connect.rollback(); } catch (SQLException ignore) {}
                connect.setAutoCommit(true);
            }

            connect.setTransactionIsolation(Connection.TRANSACTION_SERIALIZABLE);
            connect.setAutoCommit(false); // inicia transação
            return true;
        } catch (SQLException sqlex) {
            erro = "Erro: " + sqlex.toString();
            return false;
        }
    }

    public boolean Commit() {
        try {
            connect.commit();
            return true;
        } catch (SQLException e) {
            erro = "Erro: " + e.getMessage();
            return false;
        } finally {
            try { connect.setAutoCommit(true); } catch (SQLException ignore) {}
        }
    }

}
