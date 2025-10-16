package com.example.saodamiao.Control;


import com.example.saodamiao.DAO.CaixaDAO;
import com.example.saodamiao.Model.CaixaModel;

public class AtualizarCaixaControl {
    private final CaixaDAO caixaDAO;

    public AtualizarCaixaControl() {
        this.caixaDAO = new CaixaDAO();
    }
    public void registrarVenda(double valorVenda) {
        CaixaModel caixa = caixaDAO.buscarCaixaAberto();

        if (caixa == null) {
            System.out.println("Nenhum caixa aberto encontrado. Não é possível registrar a venda.");
            return;
        }

        Double valorAtual = caixa.getValorFechamento() != null
                ? caixa.getValorFechamento()
                : caixa.getValorAbertura();

        double novoValor = valorAtual + valorVenda;

        boolean atualizado = caixaDAO.atualizarValorCaixa(novoValor, caixa.getIdCaixa());

        if (atualizado) {
            System.out.printf("Caixa #%d atualizado com sucesso! Novo valor: R$ %.2f%n",
                    caixa.getIdCaixa(), novoValor);
        } else {
            System.out.println("Erro ao atualizar o valor do caixa.");
        }
    }
}