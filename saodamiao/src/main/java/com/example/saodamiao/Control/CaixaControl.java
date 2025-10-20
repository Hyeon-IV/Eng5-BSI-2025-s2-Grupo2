    package com.example.saodamiao.Control;

    import com.example.saodamiao.DAO.CaixaDAO;
    import com.example.saodamiao.Model.CaixaModel;
    import com.example.saodamiao.Model.Voluntarios;
    import com.example.saodamiao.DTO.CaixaDTO;


    public class CaixaControl {

        private final CaixaDAO dao;

        public CaixaControl(CaixaDAO dao) {
            this.dao = dao;
        }

        public CaixaDTO abrirCaixa (Voluntarios voluntario, double valorAbertura) {
            if (voluntario != null && voluntario.getIdvoluntario() != 0) {
                if (!dao.caixaAberto()) {
                    CaixaModel caixaAbertura = CaixaModel.criarAbertura(voluntario.getIdvoluntario(), valorAbertura);
                    int resultado = dao.abrirCaixaBanco(caixaAbertura);
                    if (resultado == 1) {
                        CaixaModel ultimo = dao.buscarUltimoCaixa();
                        return new CaixaDTO(ultimo, 1, "Caixa aberto com sucesso!");
                    } else {
                        return new CaixaDTO(-1, "Erro ao abrir o caixa.");
                    }
                }
                else
                    return new CaixaDTO(-2, "Já existe um caixa aberto.");
            }
            else
                return new CaixaDTO(-3, "Nenhum voluntário logado.");
        }

        public CaixaDTO fecharCaixa (Voluntarios voluntario, double valorFechamento) {
            if (voluntario != null && voluntario.getIdvoluntario() != 0) {
                if (dao.caixaAberto()) {
                    CaixaModel caixaFechamento = CaixaModel.criarFechamento(voluntario.getIdvoluntario(), valorFechamento);
                    int resultado = dao.fecharCaixaBanco(caixaFechamento);
                    if (resultado == 1) {
                        CaixaModel ultimo = dao.buscarUltimoCaixa();
                        return new CaixaDTO(ultimo, 1, "Caixa fechado com sucesso!");
                    } else {
                        return new CaixaDTO(-1, "Erro ao fechar o caixa.");
                    }
                }
                else
                    return new CaixaDTO(-2, "Nenhum caixa aberto.");
            }
            else
                return new CaixaDTO(-3, "Nenhum voluntário logado.");
        }
    }
