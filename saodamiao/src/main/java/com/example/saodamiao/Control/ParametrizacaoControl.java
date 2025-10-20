package com.example.saodamiao.Control;

import com.example.saodamiao.DTO.ParametrizacaoDTO;
import com.example.saodamiao.DTO.ParametrizacaoFormDTO;
import com.example.saodamiao.Model.Parametrizacao;
import com.example.saodamiao.Singleton.Erro;
import com.example.saodamiao.Singleton.Singleton;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/Parametrizacao")
@CrossOrigin(origins = "*")
public class ParametrizacaoControl {

    @GetMapping(value = "/home")
    ResponseEntity<Object> buscarParametrizacao(){

        Parametrizacao par = new Parametrizacao();
        Parametrizacao parametrizacao = par.getParametrizacaoDAO().pegarParametro(Singleton.Retorna());

        if(parametrizacao != null)
        {   ParametrizacaoDTO  parametrizacaoDTO = new ParametrizacaoDTO(parametrizacao);
            return ResponseEntity.ok(parametrizacaoDTO);
        }
        else
        {
            return ResponseEntity.badRequest().body(new Erro("nenhuma empresa cadastrada"));
        }
    }

    @PostMapping(value = "/inserir")
    ResponseEntity<Object> InserirParametrizacao(@RequestBody ParametrizacaoFormDTO parametrizacaoFormDTO){

        Parametrizacao par = new Parametrizacao();
        Parametrizacao parametrizacao1 = parametrizacaoFormDTO.toParametrizacao();
        if(!Singleton.Retorna().StartTransaction())
        {
            return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));
        }
        if(!par.getParametrizacaoDAO().gravar(parametrizacao1,Singleton.Retorna()))
        {
            Singleton.Retorna().Rollback(); // apenas para finalizar a transação
            return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
        }
        Singleton.Retorna().Commit();
        return ResponseEntity.ok(parametrizacaoFormDTO);
    }
}