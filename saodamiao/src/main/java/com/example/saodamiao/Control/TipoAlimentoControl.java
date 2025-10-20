package com.example.saodamiao.Control;


import com.example.saodamiao.DAO.TipoAlimentoDAO;
import com.example.saodamiao.DTO.TipoAlimentoDTO;
import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Singleton.Erro;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "apis/tipoalimento")
public class TipoAlimentoControl {

    @PostMapping(value = "/inserir")
    public ResponseEntity<Object> InsereTipoAlimento(@RequestBody TipoAlimentoDTO tipoAlimento){
        TipoAlimento t1 = new TipoAlimento();
        t1.setNome(tipoAlimento.getNome());
        if(t1.getTipoAlimentoDAO().gravar(t1)){
            return ResponseEntity.ok().body(tipoAlimento);
        }
        return ResponseEntity.badRequest().body(new Erro("Erro ao inserir TipoAlimento no banco de dados"));
    }

    @GetMapping(value = "/getall")
    public ResponseEntity<Object> allTipos(){
        TipoAlimento t1 = new TipoAlimento();
        TipoAlimentoDTO dto = new TipoAlimentoDTO();
        List<TipoAlimentoDTO> listaTipoAlimento = dto.listToDTO(t1.getTipoAlimentoDAO().pegarListaToda());
        if(listaTipoAlimento.isEmpty()){
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok().body(listaTipoAlimento);
    }
}
