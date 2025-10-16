    package com.example.saodamiao.Control;

    import com.example.saodamiao.DAO.CaixaDAO;
    import com.example.saodamiao.Model.CaixaModel;
    import com.example.saodamiao.Model.Voluntarios;

    import java.time.LocalDateTime;

    public class CaixaControl {

        private CaixaDAO dao;

        public CaixaControl() {
            dao = new CaixaDAO();
        }

        public int abrirCaixa (Voluntarios voluntario, double valorAbertura) {
            if (voluntario != null || voluntario.getIdvoluntario() != 0) {
                if (!dao.caixaAberto()) {
                    CaixaModel caixaAbertura = CaixaModel.criarAbertura(voluntario.getIdvoluntario(), valorAbertura);
                    return dao.abrirCaixaBanco(caixaAbertura);
                }
                else
                    return -2; //Caixa já aberto
            }
            else
                return -3; //Ninguem logado
        }

        public int fecharCaixa (Voluntarios voluntario, double valorFechamento) {
            if (voluntario != null || voluntario.getIdvoluntario() != 0) {
                if (dao.caixaAberto()) {
                    CaixaModel caixaFechamento = CaixaModel.criarFechamento(voluntario.getIdvoluntario(), valorFechamento);
                    return dao.fecharCaixaBanco(caixaFechamento);
                }
                else
                    return -2; //Nennhum caixa aberto
            }
            else
                return -3; //Ninguem logado
        }
    }
