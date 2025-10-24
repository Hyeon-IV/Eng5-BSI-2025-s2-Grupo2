package com.example.saodamiao.Control;

import com.example.saodamiao.Model.CaixaModel;
import com.example.saodamiao.DTO.CaixaDTO;
import com.example.saodamiao.Singleton.Erro;
import com.example.saodamiao.Singleton.Singleton;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@Controller
@RequestMapping("/api/caixa")
public class CaixaControl {

    @GetMapping("/abrirCaixa")
    public String abrirCaixaPage() {
        return "Pages/abrirCaixa"; // Apenas UMA vez "Pages"
    }

    @PostMapping("/abrir")
    public ResponseEntity<Object> abrirCaixa(@RequestBody CaixaDTO caixaDTO) {
        // Extrai os dados do DTO
        int idVoluntario = caixaDTO.getCodigo();
        double valorAbertura = caixaDTO.getValorAbertura();

        if (idVoluntario != 0) {
            CaixaModel caixa = new CaixaModel();
            var dao = caixa.getCaixaDAO();

            if (!dao.caixaAberto(Singleton.Retorna())) {
                if (!Singleton.Retorna().StartTransaction()) {
                    return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));
                }

                CaixaModel caixaAbertura = CaixaModel.criarAbertura(idVoluntario, valorAbertura);
                int resultado = dao.abrirCaixaBanco(caixaAbertura, Singleton.Retorna());

                if (resultado == 1) {
                    Singleton.Retorna().Commit();
                    CaixaModel ultimo = dao.buscarUltimoCaixa(Singleton.Retorna());
                    return ResponseEntity.ok(new CaixaDTO(ultimo, 1, "Caixa aberto com sucesso!"));
                } else {
                    Singleton.Retorna().Rollback();
                    return ResponseEntity.badRequest().body(new Erro("Erro ao abrir o caixa."));
                }
            } else {
                return ResponseEntity.badRequest().body(new Erro("Já existe um caixa aberto."));
            }
        } else {
            return ResponseEntity.badRequest().body(new Erro("Nenhum voluntário logado."));
        }
    }

    @PostMapping("/fechar")
    public ResponseEntity<Object> fecharCaixa(@RequestBody CaixaDTO caixaDTO) {
        // Extrai os dados do DTO
        int idVoluntario = caixaDTO.getCodigo();
        double valorFechamento = caixaDTO.getValorFechamento();

        if (idVoluntario != 0) {
            CaixaModel caixa = new CaixaModel();
            var dao = caixa.getCaixaDAO();

            if (dao.caixaAberto(Singleton.Retorna())) {
                if (!Singleton.Retorna().StartTransaction()) {
                    return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));
                }

                // Busca o caixa aberto para pegar o ID
                CaixaModel caixaAberto = dao.buscarCaixaAberto(Singleton.Retorna());
                if (caixaAberto != null) {
                    CaixaModel caixaFechamento = CaixaModel.criarFechamento(idVoluntario, valorFechamento);
                    int resultado = dao.fecharCaixaBanco(caixaFechamento, caixaAberto.getIdCaixa(), Singleton.Retorna());

                    if (resultado == 1) {
                        Singleton.Retorna().Commit();
                        CaixaModel ultimo = dao.buscarUltimoCaixa(Singleton.Retorna());
                        return ResponseEntity.ok(new CaixaDTO(ultimo, 1, "Caixa fechado com sucesso!"));
                    } else {
                        Singleton.Retorna().Rollback();
                        return ResponseEntity.badRequest().body(new Erro("Erro ao fechar o caixa."));
                    }
                } else {
                    Singleton.Retorna().Rollback();
                    return ResponseEntity.badRequest().body(new Erro("Caixa aberto não encontrado."));
                }
            } else {
                return ResponseEntity.badRequest().body(new Erro("Nenhum caixa aberto."));
            }
        } else {
            return ResponseEntity.badRequest().body(new Erro("Nenhum voluntário logado."));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Object> verificarCaixaAberto() {
        CaixaModel caixa = new CaixaModel();
        var dao = caixa.getCaixaDAO();
        boolean caixaAberto = dao.caixaAberto(Singleton.Retorna());
        return ResponseEntity.ok(caixaAberto);
    }

    @GetMapping("/ultimo")
    public ResponseEntity<Object> buscarUltimoCaixa() {
        CaixaModel caixa = new CaixaModel();
        var dao = caixa.getCaixaDAO();
        CaixaModel ultimoCaixa = dao.buscarUltimoCaixa(Singleton.Retorna());
        if (ultimoCaixa != null) {
            return ResponseEntity.ok(new CaixaDTO(ultimoCaixa, 1, "Último caixa encontrado"));
        } else {
            return ResponseEntity.ok(new CaixaDTO(-4, "Nenhum caixa encontrado"));
        }
    }

    @GetMapping("/aberto")
    public ResponseEntity<Object> buscarCaixaAberto() {
        CaixaModel caixa = new CaixaModel();
        var dao = caixa.getCaixaDAO();
        CaixaModel caixaAberto = dao.buscarCaixaAberto(Singleton.Retorna());
        if (caixaAberto != null) {
            return ResponseEntity.ok(new CaixaDTO(caixaAberto, 1, "Caixa aberto encontrado"));
        } else {
            return ResponseEntity.ok(new CaixaDTO(-2, "Nenhum caixa aberto"));
        }
    }

    @GetMapping("/test-dao")
    public String test() {
        CaixaModel caixa = new CaixaModel();
        var dao = caixa.getCaixaDAO();
        return "Controller funcionando! DAO: " + (dao != null ? "Instanciado" : "Null");
    }

    @GetMapping("/test-conexao")
    public ResponseEntity<String> testConexao() {
        try {
            // Testa se consegue executar uma consulta simples
            var resultado = Singleton.Retorna().consultar("SELECT 1");
            return ResponseEntity.ok("Conexão: OK - Banco conectado");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro conexão: " + e.getMessage());
        }
    }

    @GetMapping("/test-tabela")
    public ResponseEntity<String> testTabela() {
        try {
            // Testa se a tabela caixa existe
            var resultado = Singleton.Retorna().consultar("SELECT * FROM caixa LIMIT 1");
            return ResponseEntity.ok("Tabela caixa: EXISTE");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Tabela caixa: NÃO EXISTE - " + e.getMessage());
        }
    }
}