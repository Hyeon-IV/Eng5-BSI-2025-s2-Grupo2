package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.ItensVendaDAO;

public class ItensVenda {
    private int idItemVenda;
    private int idVenda;
    private int qtde;
    private int valorItem;

    private ItensVendaDAO item;
    public ItensVenda(int idItemVenda,int idVenda, int qtde, int valorItem) {
        this.idVenda = idVenda;
        this.qtde = qtde;
        this.valorItem = valorItem;
        this.idItemVenda = idItemVenda;

        item = new ItensVendaDAO();
    }

    public ItensVenda(int idItemVenda, int qtde) {
        this.idItemVenda = idItemVenda;
        this.qtde = qtde;
    }

    public int getValorItem() {
        return valorItem;
    }

    public void setValorItem(int valorItem) {
        this.valorItem = valorItem;
    }

    public int getQtde() {
        return qtde;
    }

    public void setQtde(int qtde) {
        this.qtde = qtde;
    }

    public int getIdVenda() {
        return idVenda;
    }

    public void setIdVenda(int idVenda) {
        this.idVenda = idVenda;
    }

    public int getIdItemVenda() {
        return idItemVenda;
    }

    public void setIdItemVenda(int idItemVenda) {
        this.idItemVenda = idItemVenda;
    }

    //caso a qtde for passada por parametro, eu seto a nova qtde e passo ela para o metodo de atualizarEstoque
    public Boolean AtualizarEstoque(int qtde, int idItemVenda){
        setQtde(qtde);
        return item.atualizaEstoqueItem(qtde, idItemVenda);
    }
}
