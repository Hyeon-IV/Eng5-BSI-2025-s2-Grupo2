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
        return "abrirCaixa"; // Apenas UMA vez "Pages"
    }

    @GetMapping("/fecharCaixa")
    public String fecharCaixaPage() {
        return "fecharCaixa"; // Apenas UMA vez "Pages"
    }

    @PostMapping("/abrir")
    public ResponseEntity<Object> abrirCaixa(@RequestBody CaixaDTO caixaDTO) {
        System.out.println("=== TENTATIVA DE ABRIR CAIXA ===");
        System.out.println("Dados recebidos: " + caixaDTO.getCodigo() + ", " + caixaDTO.getValorAbertura());

        // Validação dos dados
        if (caixaDTO.getCodigo() <= 0) {
            System.out.println("ERRO: Código do voluntário inválido");
            return ResponseEntity.badRequest().body(new Erro("Código do voluntário inválido."));
        }

        if (caixaDTO.getValorAbertura() <= 0) {
            System.out.println("ERRO: Valor de abertura inválido");
            return ResponseEntity.badRequest().body(new Erro("Valor de abertura deve ser maior que zero."));
        }

        int idVoluntario = caixaDTO.getCodigo();
        double valorAbertura = caixaDTO.getValorAbertura();

        CaixaModel caixa = new CaixaModel();
        var dao = caixa.getCaixaDAO();

        try {
            System.out.println("Verificando se caixa está aberto...");
            boolean caixaAberto = dao.caixaAberto(Singleton.Retorna());
            System.out.println("Caixa aberto? " + caixaAberto);

            if (!caixaAberto) {
                System.out.println("Iniciando transação...");
                if (!Singleton.Retorna().StartTransaction()) {
                    String erro = Singleton.Retorna().getMensagemErro();
                    System.out.println("ERRO na transação: " + erro);
                    return ResponseEntity.status(500).body(new Erro("Erro ao iniciar transação: " + erro));
                }

                System.out.println("Criando objeto de abertura...");
                CaixaModel caixaAbertura = CaixaModel.criarAbertura(idVoluntario, valorAbertura);
                System.out.println("Abrindo caixa no banco...");

                int resultado = dao.abrirCaixaBanco(caixaAbertura, Singleton.Retorna());
                System.out.println("Resultado da abertura: " + resultado);

                if (resultado == 1) {
                    System.out.println("Commitando transação...");
                    Singleton.Retorna().Commit();

                    System.out.println("Buscando último caixa...");
                    CaixaModel ultimo = dao.buscarUltimoCaixa(Singleton.Retorna());
                    System.out.println("Último caixa encontrado: " + (ultimo != null ? ultimo.getIdCaixa() : "null"));

                    return ResponseEntity.ok(new CaixaDTO(ultimo, 1, "Caixa aberto com sucesso!"));
                } else {
                    System.out.println("Rollback...");
                    Singleton.Retorna().Rollback();
                    return ResponseEntity.badRequest().body(new Erro("Erro ao abrir o caixa no banco."));
                }
            } else {
                System.out.println("Caixa já está aberto");
                return ResponseEntity.badRequest().body(new Erro("Já existe um caixa aberto."));
            }
        } catch (Exception e) {
            System.out.println("EXCEÇÃO: " + e.getMessage());
            e.printStackTrace();
            Singleton.Retorna().Rollback();
            return ResponseEntity.status(500).body(new Erro("Erro interno: " + e.getMessage()));
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