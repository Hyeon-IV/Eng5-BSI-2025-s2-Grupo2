package com.example.saodamiao.Control;



import com.example.saodamiao.Model.CaixaModel;

public class AtualizarCaixaControl {

    public AtualizarCaixaControl(int idCaixa, int qtde) {
        CaixaModel caixa = new CaixaModel(idCaixa);
        caixa.atualizarCaixa(idCaixa, qtde);
    }

}
