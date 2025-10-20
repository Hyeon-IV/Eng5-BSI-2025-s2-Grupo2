package com.example.saodamiao.Control;

import com.example.saodamiao.Model.Cliente;
import com.example.saodamiao.Singleton.Erro;
import com.example.saodamiao.Singleton.Singleton;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value="apis/clientes")
public class ClienteControl {

    @PostMapping(value = "/inserir")
    public ResponseEntity<Object> InsereAlimento(@RequestBody Cliente cliente){
        // Valida CPF antes de abrir transação
        if (!cliente.isCPF(cliente.getCpf())) {
            return ResponseEntity.badRequest().body(new Erro("CPF inválido!!"));
        }

        if(!Singleton.Retorna().StartTransaction())
            return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));
        if(cliente.getClienteDAO().PegarCliente(cliente.getCpf(), Singleton.Retorna()) != null)
            return ResponseEntity.badRequest().body(new Erro("Já tem um cliente cadastrado com esse CPF"));
        if(!cliente.getClienteDAO().gravar(cliente, Singleton.Retorna())) {
            Singleton.Retorna().Rollback();
            return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
        }

        Singleton.Retorna().Commit();
        return ResponseEntity.ok(cliente);
    }

    @GetMapping(value = "/pegalista")
    public ResponseEntity<Object> getAll(){
        Cliente cliente = new Cliente();
        List<Cliente> clienteList = cliente.getClienteDAO().pegarListaToda(Singleton.Retorna());
        return ResponseEntity.ok(clienteList);
    }

    @DeleteMapping(value = "/deletar")
    public ResponseEntity<Object> deletar(@RequestBody Cliente cliente){
        if(!Singleton.Retorna().StartTransaction())
            return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));

        if(!cliente.getClienteDAO().apagar(cliente, Singleton.Retorna())) {
            Singleton.Retorna().Rollback(); // apenas para finalizar a transação
            return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
        }
        Singleton.Retorna().Commit();
        return ResponseEntity.ok(cliente);
    }

    @PutMapping(value = "/alterar/{cpfAntigo}")
    public ResponseEntity<Object> alterar(@PathVariable String cpfAntigo, @RequestBody Cliente cliente){
        // valida os dois CPFs antes
        if (!cliente.isCPF(cpfAntigo) || !cliente.isCPF(cliente.getCpf())) {
            return ResponseEntity.badRequest().body(new Erro("CPF inválido!"));
        }
        if(cliente.getClienteDAO().PegarCliente(cliente.getCpf(), Singleton.Retorna()) != null)
            return ResponseEntity.badRequest().body(new Erro("Já tem um cliente cadastrado com esse CPF"));
        if(!Singleton.Retorna().StartTransaction())
            return ResponseEntity.status(500).body(new Erro(Singleton.Retorna().getMensagemErro()));

        if(!cliente.getClienteDAO().alterar(cliente, cpfAntigo, Singleton.Retorna())) {
            Singleton.Retorna().Rollback();
            return ResponseEntity.badRequest().body(new Erro("Problema ao gravar no banco de dados"));
        }
        Singleton.Retorna().Commit();
        return ResponseEntity.ok(cliente);
    }

}
