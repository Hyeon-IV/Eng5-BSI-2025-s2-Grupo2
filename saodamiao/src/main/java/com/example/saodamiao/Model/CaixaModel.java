package com.example.saodamiao.Model;

import com.example.saodamiao.DAO.CaixaDAO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public class CaixaModel {
    private int idCaixa;
    private Date dataAbertura;
    private Double valorAbertura;
    private int loginAbertura;
    private Date dataFechamento;
    private Double valorFechamento;
    private int loginFechamento;

    @JsonIgnore
    private CaixaDAO caixaDAO;

    public CaixaModel() {
        caixaDAO = new CaixaDAO();
    }

    // Construtor completo
    public CaixaModel(int idCaixa, Date dataAbertura, Double valorAbertura, int loginAbertura,
                      Date dataFechamento, Double valorFechamento, int loginFechamento) {
        this.idCaixa = idCaixa;
        this.dataAbertura = dataAbertura;
        this.valorAbertura = valorAbertura;
        this.loginAbertura = loginAbertura;
        this.dataFechamento = dataFechamento;
        this.valorFechamento = valorFechamento;
        this.loginFechamento = loginFechamento;
        this.caixaDAO = new CaixaDAO();
    }

    public static CaixaModel criarAbertura(int idVoluntario, double valorAbertura) {
        CaixaModel caixa = new CaixaModel();
        caixa.dataAbertura = new Date();
        caixa.valorAbertura = valorAbertura;
        caixa.loginAbertura = idVoluntario;
        return caixa;
    }

    public static CaixaModel criarFechamento(int idVoluntario, double valorFechamento) {
        CaixaModel caixa = new CaixaModel();
        caixa.dataFechamento = new Date();
        caixa.valorFechamento = valorFechamento;
        caixa.loginFechamento = idVoluntario;
        return caixa;
    }
}