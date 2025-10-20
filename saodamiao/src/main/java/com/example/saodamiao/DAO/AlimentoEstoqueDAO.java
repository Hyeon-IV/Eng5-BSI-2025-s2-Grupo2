package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.AlimentoEstoque;
import com.example.saodamiao.Singleton.Singleton;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public class AlimentoEstoqueDAO {
    public AlimentoEstoqueDAO() {}


    public boolean inserirOuAtualizar(AlimentoEstoque entidade) {
       String SQL = "INSERT INTO ESTOQUE_ALIMENTO VALUES (#1,#2,'#3');";
       SQL.replace("#1", String.valueOf(entidade.getId_alimento()));
       SQL.replace("#2", String.valueOf(entidade.getQuantidade()));
       SQL.replace("#3", String.valueOf(entidade.getValidade()));
       if(!Singleton.Retorna().manipular(SQL)){
           Atualiza(entidade);
       }
       return true;
    }

    public void Atualiza(AlimentoEstoque entidade){
        String SQL = "select * from ESTOQUE_ALIMENTO where alimentos_idAlimentos=#1 and ESA_VALIDADE ='#2';";
        SQL = SQL.replace("#1", String.valueOf(entidade.getId_alimento()));
        SQL = SQL.replace("#2", String.valueOf(entidade.getValidade()));
        try{
            ResultSet rs = Singleton.Retorna().consultar(SQL);
            if(rs.next()){
                entidade.setQuantidade(entidade.getQuantidade()+ rs.getInt("ESA_QTD"));
                SQL = "UPDATE FROM ESTOQUE_ALIMENTO SET ESA_QTD=#1 WHERE alimentos_idAlimentos=#2 and ESA_VALIDADE ='#3';";
                SQL = SQL.replace("#1", String.valueOf(entidade.getQuantidade()));
                SQL = SQL.replace("#2", String.valueOf(entidade.getId_alimento()));
                SQL = SQL.replace("#3", String.valueOf(entidade.getValidade()));
                Singleton.Retorna().manipular(SQL);
            }

        }catch (SQLException e){
            e.printStackTrace();
        }
    }

}
