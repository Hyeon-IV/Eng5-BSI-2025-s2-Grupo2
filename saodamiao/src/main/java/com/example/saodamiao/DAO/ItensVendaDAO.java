package com.example.saodamiao.DAO;

import com.example.saodamiao.Singleton.Conexao;

public class ItensVendaDAO {
    Conexao con;

    public ItensVendaDAO(){
        con = new Conexao();
        con.conectar("jdbc:postgresql://localhost/", "bazar", "postgres", "1234");
    }

    public Boolean atualizaEstoqueItem(int qtde, int id){
        String sql = "UPDATE itens_venda SET qtde = " + qtde + "WHERE item_bazar_iditem_bazar = "+ id;
        return con.manipular(sql);
    }
}
