package com.example.saodamiao.Control;

import com.example.saodamiao.DTO.TipoBazarDTO;
import com.example.saodamiao.Model.TipoBazar;
import com.example.saodamiao.Singleton.Erro;
import com.example.saodamiao.Singleton.Singleton;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "apis/tipobazar")
public class TipoBazarControl {

    @PostMapping(value = "/inserir")
    public ResponseEntity<Object> insereTipoBazar(@RequestBody TipoBazarDTO tipoBazarDTO) {
        try {
            // Vazio?
            if (tipoBazarDTO.getDesc() == null || tipoBazarDTO.getDesc().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new Erro("Descrição não pode ser vazia"));
            }

            String descricao = tipoBazarDTO.getDesc().trim();

            // primeira letra maiuscula
            String descricaoPadronizada = descricao.substring(0, 1).toUpperCase() +
                    descricao.substring(1).toLowerCase();

            TipoBazar tipoBazar = new TipoBazar();
            tipoBazar.setDesc(descricaoPadronizada);

            // ja existe?
            TipoBazar existente = tipoBazar.getTipoBazarDAO().ResgatarTipo(descricaoPadronizada, Singleton.Retorna());
            if (existente != null) {
                return ResponseEntity.badRequest().body(new Erro("Já existe um tipo de bazar com a descrição: " + descricaoPadronizada));
            }

            // insere
            if (tipoBazar.getTipoBazarDAO().gravar(tipoBazar, Singleton.Retorna())) {
                tipoBazarDTO.setDesc(descricaoPadronizada);
                tipoBazarDTO.setId(tipoBazar.getId());
                return ResponseEntity.ok().body(tipoBazarDTO);
            }
            return ResponseEntity.badRequest().body(new Erro("Erro ao inserir TipoBazar no banco de dados"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Erro("Erro interno: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/getall")
    public ResponseEntity<Object> allTipos() {
        TipoBazar tipoBazar = new TipoBazar();
        TipoBazarDTO dto = new TipoBazarDTO();
        List<TipoBazarDTO> listaTipoBazar = dto.listToDTO(tipoBazar.getTipoBazarDAO().pegarListaToda(Singleton.Retorna()));

        // não tem nada
        if (listaTipoBazar.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Retorna lista
        return ResponseEntity.ok().body(listaTipoBazar);
    }

    @PutMapping(value = "/alterar")
    public ResponseEntity<Object> alteraTipoBazar(@RequestBody TipoBazarDTO tipoBazarDTO) {
        try {
            // Valida desc
            if (tipoBazarDTO.getDesc() == null || tipoBazarDTO.getDesc().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new Erro("Descrição não pode ser vazia"));
            }

            String descricao = tipoBazarDTO.getDesc().trim();
            String descricaoPadronizada = descricao.substring(0, 1).toUpperCase() +
                    descricao.substring(1).toLowerCase();

            TipoBazar tipoBazar = new TipoBazar();

            // ja existe?
            TipoBazar existente = tipoBazar.getTipoBazarDAO().ResgatarTipo(descricaoPadronizada, Singleton.Retorna());
            if (existente != null && existente.getId() != tipoBazarDTO.getId()) {
                return ResponseEntity.badRequest().body(new Erro("Já existe outro tipo de bazar com a descrição: " + descricaoPadronizada));
            }

            // enta alterar
            tipoBazar.setId(tipoBazarDTO.getId());
            tipoBazar.setDesc(descricaoPadronizada);

            if (tipoBazar.getTipoBazarDAO().alterar(tipoBazar, tipoBazarDTO.getId(), Singleton.Retorna())) {
                tipoBazarDTO.setDesc(descricaoPadronizada);
                return ResponseEntity.ok().body(tipoBazarDTO);
            }
            return ResponseEntity.badRequest().body(new Erro("Erro ao alterar TipoBazar no banco de dados"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Erro("Erro interno: " + e.getMessage()));
        }
    }

    @DeleteMapping(value = "/deletar")
    public ResponseEntity<Object> deletaTipoBazar(@RequestBody TipoBazarDTO tipoBazarDTO) {
        TipoBazar tipoBazar = new TipoBazar();
        tipoBazar.setId(tipoBazarDTO.getId());

        // Tenta deleta
        if (tipoBazar.getTipoBazarDAO().apagar(tipoBazar, Singleton.Retorna())) {
            return ResponseEntity.ok().body("TipoBazar deletado com sucesso");
        }
        return ResponseEntity.badRequest().body(new Erro("Erro ao deletar TipoBazar do banco de dados"));
    }

    @PostMapping(value = "/buscar/id")
    public ResponseEntity<Object> buscaTipoBazarPorId(@RequestBody TipoBazarDTO tipoBazarDTO) {
        TipoBazar tipoBazar = new TipoBazar();
        TipoBazar resultado = tipoBazar.getTipoBazarDAO().ResgatarTipo(tipoBazarDTO.getId(), Singleton.Retorna());

        // achou
        if (resultado != null) {
            TipoBazarDTO responseDTO = new TipoBazarDTO();
            responseDTO.setId(resultado.getId());
            responseDTO.setDesc(resultado.getDesc());
            return ResponseEntity.ok().body(responseDTO);
        }
        // Nao
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/buscar/desc")
    public ResponseEntity<Object> buscaTipoBazarPorDescricao(@RequestBody TipoBazarDTO tipoBazarDTO) {
        TipoBazar tipoBazar = new TipoBazar();
        TipoBazar resultado = tipoBazar.getTipoBazarDAO().ResgatarTipo(tipoBazarDTO.getDesc(), Singleton.Retorna());

        // achou
        if (resultado != null) {
            TipoBazarDTO responseDTO = new TipoBazarDTO();
            responseDTO.setId(resultado.getId());
            responseDTO.setDesc(resultado.getDesc());
            return ResponseEntity.ok().body(responseDTO);
        }
        // Não achou
        return ResponseEntity.notFound().build();
    }
}