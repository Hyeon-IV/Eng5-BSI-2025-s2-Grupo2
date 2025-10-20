package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.CaixaModel;
import com.example.saodamiao.Singleton.Conexao;

import java.sql.ResultSet;
import java.sql.SQLException;

public class CaixaDAO {

    private final Conexao con;

    public CaixaDAO(Conexao conexao) {
        this.con = conexao;
    }

    public boolean caixaAberto() {
        String sql = "SELECT idcaixa FROM caixa WHERE datafechamento IS NULL";
        try {
            ResultSet rs = con.consultar(sql);
            if (rs.next()) {
                return true;
            } else {
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public int abrirCaixaBanco(CaixaModel caixa) {
        String sql = "INSERT INTO caixa (dataabertura, valorabertura, loginabertura) " +
                "VALUES (NOW(), " + caixa.getValorAbertura() + ", " + caixa.getLoginAbertura() + ")";

        if (con.manipular(sql)) {
            return 1; // Sucesso
        } else {
            return -1; // Erro
        }
    }

    public int fecharCaixaBanco(CaixaModel caixa) {
        String sql = "UPDATE caixa SET datafechamento = NOW(), " +
                "valorfechamento = " + caixa.getValorFechamento() + ", " +
                "loginfechamento = " + caixa.getLoginFechamento() + " " +
                "WHERE datafechamento IS NULL";

        if (con.manipular(sql)) {
            return 1; // Sucesso
        } else {
            return -1; // Erro
        }
    }

    public CaixaModel buscarUltimoCaixa() {
        String sql = "SELECT * FROM caixa ORDER BY idcaixa DESC LIMIT 1";
        try {
            ResultSet rs = con.consultar(sql);
            if (rs.next()) {
                CaixaModel caixa = new CaixaModel();
                caixa.setIdCaixa(rs.getInt("idcaixa"));
                caixa.setValorAbertura(rs.getDouble("valorabertura"));
                caixa.setValorFechamento(rs.getDouble("valorfechamento"));
                caixa.setLoginAbertura(rs.getInt("loginabertura"));
                caixa.setLoginFechamento(rs.getInt("loginfechamento"));
                caixa.setDataAbertura(rs.getTimestamp("dataabertura"));
                caixa.setDataFechamento(rs.getTimestamp("datafechamento"));
                return caixa;
            } else {
                return null;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
