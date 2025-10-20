package com.example.saodamiao.Control;

import com.example.saodamiao.Model.EstoqueAlimentos;
import com.example.saodamiao.Model.ItensVenda;

public class EstoqueControl{

    public Boolean AtualizarEstoqueAlimento(int idAlimento, int qtde){
        EstoqueAlimentos alimento = new EstoqueAlimentos(idAlimento, qtde);
        return alimento.AtualizarEstoqueAlimento(qtde);
    }
    public Boolean AtualizarEstoqueItem(int idItem, int qtde){
        ItensVenda itens = new ItensVenda(idItem, qtde);
        return itens.AtualizarEstoque(idItem, qtde);
    }
}
