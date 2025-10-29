package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.CaixaModel;
import com.example.saodamiao.Singleton.Conexao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CaixaDAO implements IDAO<CaixaModel> {

    private Conexao con;

    @Override
    public boolean gravar(CaixaModel entidade, Conexao conexao) {
        try {
            String sql = """
            INSERT INTO caixa (data_abertura, valor_abertura, login_abertura)
            VALUES (NOW(), #1, #2)
            """;
            sql = sql.replace("#1", String.valueOf(entidade.getValorAbertura()));
            sql = sql.replace("#2", String.valueOf(entidade.getLoginAbertura()));

            System.out.println("SQL executado: " + sql);
            boolean resultado = conexao.manipular(sql);
            System.out.println("Resultado do INSERT: " + resultado);

            return resultado;
        } catch (Exception e) {
            System.out.println("ERRO no gravar: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean alterar(CaixaModel entidade, int id, Conexao conexao) {
        String sql = """
                UPDATE caixa 
                SET valor_fechamento = #1,
                    login_fechamento = #2,
                    data_fechamento = NOW()
                WHERE idcaixa = #3
                """;
        sql = sql.replace("#1", String.valueOf(entidade.getValorFechamento()));
        sql = sql.replace("#2", String.valueOf(entidade.getLoginFechamento()));
        sql = sql.replace("#3", String.valueOf(id));
        return conexao.manipular(sql);
    }

    @Override
    public boolean apagar(CaixaModel entidade, Conexao conexao) {
        String sql = "DELETE FROM caixa WHERE idcaixa = #1";
        sql = sql.replace("#1", String.valueOf(entidade.getIdCaixa()));
        return conexao.manipular(sql);
    }

    @Override
    public List<CaixaModel> pegarListaToda(Conexao conexao) {
        List<CaixaModel> caixas = new ArrayList<>();
        String sql = "SELECT * FROM caixa ORDER BY idcaixa DESC";
        ResultSet rs = conexao.consultar(sql);

        try {
            while (rs.next()) {
                CaixaModel caixa = new CaixaModel(
                        rs.getInt("idcaixa"),
                        rs.getTimestamp("data_abertura"),
                        rs.getDouble("valor_abertura"),
                        rs.getInt("login_abertura"),
                        rs.getTimestamp("data_fechamento"),
                        rs.getDouble("valor_fechamento"),
                        rs.getInt("login_fechamento")
                );
                caixas.add(caixa);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return caixas;
    }

    // Métodos específicos do CaixaDAO
    public boolean caixaAberto(Conexao conexao) {
        String sql = "SELECT idcaixa FROM caixa WHERE data_fechamento IS NULL";
        try {
            ResultSet rs = conexao.consultar(sql);
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public int abrirCaixaBanco(CaixaModel caixa, Conexao conexao) {
        if (gravar(caixa, conexao)) {
            return 1; // Sucesso
        } else {
            return -1; // Erro
        }
    }

    public int fecharCaixaBanco(CaixaModel caixa, int idCaixa, Conexao conexao) {
        if (alterar(caixa, idCaixa, conexao)) {
            return 1; // Sucesso
        } else {
            return -1; // Erro
        }
    }

    public CaixaModel buscarUltimoCaixa(Conexao conexao) {
        String sql = "SELECT * FROM caixa ORDER BY idcaixa DESC LIMIT 1";
        try {
            ResultSet rs = conexao.consultar(sql);
            if (rs.next()) {
                return new CaixaModel(
                        rs.getInt("idcaixa"),
                        rs.getTimestamp("data_abertura"),
                        rs.getDouble("valor_abertura"),
                        rs.getInt("login_abertura"),
                        rs.getTimestamp("data_fechamento"),
                        rs.getDouble("valor_fechamento"),
                        rs.getInt("login_fechamento")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean atualizarValorCaixa(double novoValor, int idCaixa, Conexao conexao) {
        String sql = "UPDATE caixa SET valor_fechamento = #1 WHERE idcaixa = #2";
        sql = sql.replace("#1", String.valueOf(novoValor));
        sql = sql.replace("#2", String.valueOf(idCaixa));
        return conexao.manipular(sql);
    }

    public CaixaModel buscarCaixaAberto(Conexao conexao) {
        String sql = "SELECT * FROM caixa WHERE data_fechamento IS NULL";
        try {
            ResultSet rs = conexao.consultar(sql);
            if (rs.next()) {
                return new CaixaModel(
                        rs.getInt("idcaixa"),
                        rs.getTimestamp("data_abertura"),
                        rs.getDouble("valor_abertura"),
                        rs.getInt("login_abertura"),
                        rs.getTimestamp("data_fechamento"),
                        rs.getDouble("valor_fechamento"),
                        rs.getInt("login_fechamento")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}