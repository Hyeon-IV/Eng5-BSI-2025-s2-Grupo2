package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Model.TipoBazar;
import com.example.saodamiao.Singleton.Conexao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TipoBazarDAO implements IDAO<TipoBazar>{

    public TipoBazarDAO() {}

    @Override
    public boolean gravar(TipoBazar entidade, Conexao conexao) {
        String SQL = "INSERT INTO tipo_bazar (tpb_desc) VALUES ('#2');";
        SQL = SQL.replace("#2", ""+entidade.getDesc().toLowerCase());

        return conexao.manipular(SQL);
    }

    @Override
    public boolean alterar(TipoBazar entidade, int id, Conexao conexao) {
        String sql = """
            UPDATE tipo_bazar 
            SET tpb_desc = '#2'
            WHERE tpb_id = #1
            """;
        sql = sql.replace("#1", String.valueOf(entidade.getId()));
        sql = sql.replace("#2", String.valueOf(entidade.getDesc()));
        return conexao.manipular(sql);
    }

    @Override
    public boolean apagar(TipoBazar entidade, Conexao conexao) {
        String sql = "DELETE FROM tipo_bazar WHERE tpb_id = #1";
        sql = sql.replace("#1", String.valueOf(entidade.getId()));
        return conexao.manipular(sql);
    }

    @Override
    public List<TipoBazar> pegarListaToda(Conexao conexao) {
        List<TipoBazar> lista = new ArrayList<>();
        String SQL = "SELECT * FROM tipo_bazar;";
        try{
            ResultSet rs = conexao.consultar(SQL);
            while(rs.next()){
                TipoBazar entidade = new TipoBazar();
                entidade.setId(rs.getInt("tpb_id")); // ID
                entidade.setDesc(rs.getString("tpb_desc")); // Descrição
                lista.add(entidade); // Joga na lista
            }
        } catch (SQLException e) {
            throw new RuntimeException(e); // Deu ruim
        }
        return lista;
    }

    public TipoBazar ResgatarTipo(String desc, Conexao conexao) {
        TipoBazar entidade = null;
        if (desc == null) return null;

        // Trata aspas pra não quebrar
        String descFormatada = desc.replace("'", "''");
        String SQL = "select * from tipo_bazar where LOWER(tpb_desc) = LOWER('" + descFormatada + "');";

        try {
            ResultSet rs = conexao.consultar(SQL);
            // Se achou
            if (rs != null) {
                if (rs.next()) {
                    entidade = new TipoBazar();
                    entidade.setDesc(rs.getString("tpb_desc"));
                    entidade.setId(rs.getInt("tpb_id"));
                }
                rs.close();
            }
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
            e.printStackTrace();
        }
        return entidade;
    }

    public TipoBazar ResgatarTipo(int id,  Conexao conexao){
        TipoBazar entidade = null;
        String SQL = "select * from tipo_bazar where tpb_id ="+id+";";
        try{
            ResultSet rs = conexao.consultar(SQL);
            if(rs.next()){ // Se achou
                entidade = new TipoBazar();
                entidade.setDesc(rs.getString("tpb_desc"));
                entidade.setId(rs.getInt("tpb_id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return entidade;
    }
}