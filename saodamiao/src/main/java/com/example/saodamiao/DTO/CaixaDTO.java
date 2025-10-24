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

    // CONSTRUTOR PADRÃO VAZIO (OBRIGATÓRIO para o Jackson)
    public CaixaDTO() {
    }

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

    // GETTERS E SETTERS PARA TODOS OS CAMPOS
    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public int getIdCaixa() {
        return idCaixa;
    }

    public void setIdCaixa(int idCaixa) {
        this.idCaixa = idCaixa;
    }

    public double getValorAbertura() {
        return valorAbertura;
    }

    public void setValorAbertura(double valorAbertura) {
        this.valorAbertura = valorAbertura;
    }

    public double getValorFechamento() {
        return valorFechamento;
    }

    public void setValorFechamento(double valorFechamento) {
        this.valorFechamento = valorFechamento;
    }

    public String getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(String dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(String dataFechamento) {
        this.dataFechamento = dataFechamento;
    }
}