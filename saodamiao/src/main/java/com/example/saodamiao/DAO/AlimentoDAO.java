package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Singleton.Conexao;
import com.example.saodamiao.Singleton.Singleton;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AlimentoDAO implements IDAO<Alimento> {


    public AlimentoDAO(){
    }

    @Override
    public boolean gravar(Alimento entidade, Conexao conexao)  { // tornar o nome unico o banco tambem
        String SQL = "INSERT INTO alimentos (nome, tipo_alimento_tpa_id) values ('#2',#3)";
        SQL =SQL.replace("#2", entidade.getNome().toLowerCase());
        SQL =SQL.replace("#3", String.valueOf(entidade.getTipo_alimento_id()));

        return conexao.manipular(SQL);

    }


    @Override
    public boolean alterar(Alimento entidade, int id, Conexao conexao) {
        String SQL = ("UPDATE FROM alimentos SET nome = '#2', tipo_alimento_tpa_id = #3 where id = "+id +"");
        SQL = SQL.replace("#2", entidade.getNome().toLowerCase());
        SQL = SQL.replace("#3", String.valueOf(entidade.getTipo_alimento_id()));
        try {
            return conexao.manipular(SQL);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public boolean apagar(Alimento entidade, Conexao conexao) {
        String SQL = "DELETE FROM alimentos WHERE nome = '#2'";
        SQL = SQL.replace("#2", entidade.getNome().toLowerCase());

        try{
            return conexao.manipular(SQL);
        }
        catch (Exception e){
            e.printStackTrace();
            return false;
        }

    }

    @Override
    public List<Alimento> pegarListaToda(Conexao conexao) {
        List<Alimento> alimentos = new ArrayList<>();
        String SQL = "SELECT * FROM alimentos";
        try{
            ResultSet rs = conexao.consultar(SQL);
            while (rs.next()){
                Alimento alimento = new Alimento(rs.getInt("idAlimentos"),rs.getString("nome"), rs.getInt("TIPO_ALIMENTO_TPA_ID"));
                alimentos.add(alimento);
            }
            rs.close();

        }catch (Exception e){
            e.printStackTrace();
        }
        return alimentos;
    }

    public Alimento ResgatarAlimento(String nome, Conexao conexao)  {
        String SQL = "SELECT * FROM alimentos WHERE nome = '#2'";
        Alimento alimento = null;
        SQL = SQL.replace("#2", nome.toLowerCase());
        try{
            ResultSet rs = conexao.consultar(SQL);
            if(rs.next()){
                alimento = new Alimento();
                alimento.setId(rs.getInt("idAlimentos"));
                alimento.setNome(rs.getString("nome"));
                alimento.setTipo_alimento_id(rs.getInt("tipo_alimento_tpa_id"));
            }
            rs.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return alimento;
    }
}
