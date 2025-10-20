package com.example.saodamiao.DTO;

import com.example.saodamiao.Model.CaixaModel;
import java.text.SimpleDateFormat;

public class CaixaDTO {

    private int codigo;
    private String mensagem;
    private int idCaixa;
    private double valorAbertura;
    private double valorFechamento;
    private String dataAbertura;
    private String dataFechamento;

    public CaixaDTO(int codigo, String mensagem) {
        this.codigo = codigo;
        this.mensagem = mensagem;
    }

    public CaixaDTO(CaixaModel caixa, int codigo, String mensagem) {
        this.idCaixa = caixa.getIdCaixa();
        this.codigo = codigo;
        this.mensagem = mensagem;

        if (caixa != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

            if (caixa.getValorAbertura() != null) {
                this.valorAbertura = caixa.getValorAbertura();
            } else {
                this.valorAbertura = 0.0;
            }

            if (caixa.getValorFechamento() != null) {
                this.valorFechamento = caixa.getValorFechamento();
            } else {
                this.valorFechamento = 0.0;
            }

            if (caixa.getDataAbertura() != null) {
                this.dataAbertura = sdf.format(caixa.getDataAbertura());
            } else {
                this.dataAbertura = "";
            }

            if (caixa.getDataFechamento() != null) {
                this.dataFechamento = sdf.format(caixa.getDataFechamento());
            } else {
                this.dataFechamento = "";
            }
        }
    }

    public int getCodigo() {
        return codigo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public int getIdCaixa() {
        return idCaixa;
    }

    public double getValorAbertura() {
        return valorAbertura;
    }

    public double getValorFechamento() {
        return valorFechamento;
    }

    public String getDataAbertura() {
        return dataAbertura;
    }

    public String getDataFechamento() {
        return dataFechamento;
    }
}
