package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Singleton.Singleton;
import lombok.Data;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class TipoAlimentoDAO implements IDAO<TipoAlimento>{
    public TipoAlimentoDAO() {
    }

    @Override
    public boolean gravar(TipoAlimento entidade) {
        String SQL = "INSERT INTO TIPO_ALIMENTO (TPA_DESC) VALUES ('#2');";
        SQL = SQL.replace("#2", ""+entidade.getNome().toLowerCase());

        return Singleton.Retorna().manipular(SQL);
    }

    @Override
    public boolean alterar(TipoAlimento entidade, int id) {
        return false;
    }

    @Override
    public boolean apagar(TipoAlimento entidade) {
        return false;
    }

    @Override
    public List<TipoAlimento> pegarListaToda() {
        List<TipoAlimento> lista = new ArrayList<>();
        String SQL = "SELECT * FROM TIPO_ALIMENTO;";
        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
            while(rs.next()){
                TipoAlimento entidade = new TipoAlimento();
                entidade.setId(rs.getInt("TPA_ID"));
                entidade.setNome(rs.getString("TPA_DESC"));
                lista.add(entidade);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return lista;
    }

    public TipoAlimento ResgatarTipo(String nome){ // atributo unico o nome
        TipoAlimento entidade = null;
        String SQL = "select * from TIPO_ALIMENTO where TPA_DESC = '#2';";
        SQL = SQL.replace("#2", nome.toLowerCase());
        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
            if(rs.next()){
                entidade = new TipoAlimento();
                entidade.setNome(rs.getString("TPA_DESC"));
                entidade.setId(rs.getInt("TPA_ID"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return entidade;
    }
}
