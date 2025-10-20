package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Singleton.Singleton;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AlimentoDAO implements IDAO<Alimento> {


    public AlimentoDAO(){
    }

    @Override
    public boolean gravar(Alimento entidade) { // tornar o nome unico o banco tambem
        String SQL = "INSERT INTO alimentos (nome, tipo_alimento_tpa_id) values ('#2',#3)";
        SQL =SQL.replace("#2", entidade.getNome().toLowerCase());
       SQL =SQL.replace("#3", String.valueOf(entidade.getTipo_alimento_id()));


        return Singleton.Retorna().manipular(SQL);

    }


    @Override
    public boolean alterar(Alimento entidade, int id) {
        String SQL = ("UPDATE FROM alimentos SET nome = '#2', tipo_alimento_tpa_id = #3 where id = "+id +"");
        SQL = SQL.replace("#2", entidade.getNome().toLowerCase());
        SQL = SQL.replace("#3", String.valueOf(entidade.getTipo_alimento_id()));
        try {
            ResultSet rs =  Singleton.Retorna().consultar(SQL);
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public boolean apagar(Alimento entidade) {
        String SQL = "DELETE FROM alimentos WHERE nome = '#2'";
        SQL = SQL.replace("#2", entidade.getNome().toLowerCase());

        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
        }
        catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public List<Alimento> pegarListaToda()  {
        List<Alimento> alimentos = new ArrayList<>();
        String SQL = "SELECT * FROM alimentos";
        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
            while (rs.next()){
                Alimento alimento = new Alimento(rs.getInt("idAlimentos"),rs.getString("nome"), rs.getInt("TIPO_ALIMENTO_TPA_ID"));
                alimentos.add(alimento);
            }

        }catch (Exception e){
            e.printStackTrace();
        }
        return alimentos;
    }

    public Alimento ResgatarAlimento(String nome){
        String SQL = "SELECT * FROM alimentos WHERE nome = '#2'";
        Alimento alimento = null;
        SQL = SQL.replace("#2", nome.toLowerCase());
        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
            if(rs.next()){
                alimento = new Alimento();
                alimento.setId(rs.getInt("idAlimentos"));
                alimento.setNome(rs.getString("nome"));
                alimento.setTipo_alimento_id(rs.getInt("tipo_alimento_tpa_id"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return alimento;
    }
}
