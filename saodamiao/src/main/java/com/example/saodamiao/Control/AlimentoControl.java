package com.example.saodamiao.Control;

import com.example.saodamiao.DTO.AlimentoDTO;
import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Singleton.Erro;
import com.example.saodamiao.Singleton.Singleton;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping(value="apis/alimentos")
@CrossOrigin(origins = "*")
public class AlimentoControl {

    @PostMapping(value = "/inserir")
    public ResponseEntity<Object> InsereAlimento(@RequestBody AlimentoDTO alimentoDTO) {
        Alimento alimento = alimentoDTO.toAlimento();

        if(!Singleton.Retorna().StartTransaction())
            return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));

        if(!alimento.getAlimentoDAO().gravar(alimento, Singleton.Retorna())) {
            Singleton.Retorna().Rollback();

            return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
        }
        Singleton.Retorna().Commit();
        return ResponseEntity.ok(alimentoDTO);
    }

    @PutMapping(value = "/atualizar")
    public ResponseEntity<Object> AtualizarAlimento(@RequestBody AlimentoDTO alimentoDTO){


        return null;
    }

    @DeleteMapping(value = "/deletar")
    public ResponseEntity<Object> DeletarAlimento(@RequestBody AlimentoDTO alimentoDTO){
        Singleton.Retorna().StartTransaction();

        return null;
    }

    @GetMapping(value = "/getall")
    public ResponseEntity<Object> getAlimentos() {

        AlimentoDTO alimentoDTO = new AlimentoDTO();
        Alimento alimento = new Alimento();

        List<AlimentoDTO> alimentosDTO = alimentoDTO.toArrayDTO(
                alimento.getAlimentoDAO().pegarListaToda(Singleton.Retorna())
        );

        if(alimentosDTO.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(alimentosDTO);
    }
}