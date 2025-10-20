package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.EstoqueAlimentosDAO;

import java.util.Date;

public class EstoqueAlimentos {
    private int idAlimento;
    private Date validade;
    private int qtde;

    private EstoqueAlimentosDAO estoqueDAO;
    public EstoqueAlimentos(int idAlimento, Date validade, int qtde) {
        this.idAlimento = idAlimento;
        this.validade = validade;
        this.qtde = qtde;
    }

    public EstoqueAlimentos(int idAlimento, int qtde) {
        this.idAlimento = idAlimento;
        this.validade = null;
        this.qtde = qtde;
    }

    public int getIdAlimento() {
        return idAlimento;
    }

    public void setIdAlimento(int idAlimento) {
        this.idAlimento = idAlimento;
    }

    public Date getValidade() {
        return validade;
    }

    public void setValidade(Date validade) {
        this.validade = validade;
    }

    public int getQtde() {
        return qtde;
    }

    public void setQtde(int qtde) {
        this.qtde = qtde;
    }

    public Boolean AtualizarEstoqueAlimento(int qtde){
        setQtde(qtde);
        return estoqueDAO.atualizarEstoqueAlimentos(qtde, idAlimento);
    }
}
