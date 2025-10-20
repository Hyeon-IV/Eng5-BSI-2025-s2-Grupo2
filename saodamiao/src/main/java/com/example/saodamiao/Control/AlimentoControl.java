package com.example.saodamiao.Control;

import com.example.saodamiao.DTO.AlimentoDTO;
import com.example.saodamiao.Model.Alimento;
import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Singleton.Erro;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value="apis/alimentos")
@CrossOrigin(origins = "*")
public class AlimentoControl {

    @PostMapping(value = "/inserir")
    public ResponseEntity<Object> InsereAlimento(@RequestBody AlimentoDTO alimentoDTO){
        Alimento alimento = alimentoDTO.toAlimento();
        if(alimento.getAlimentoDAO().gravar(alimento)){
            return ResponseEntity.ok(alimentoDTO);
        }
        return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
    }

}
