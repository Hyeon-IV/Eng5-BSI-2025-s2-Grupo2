package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Cliente;
import com.example.saodamiao.Singleton.Conexao;
import com.example.saodamiao.Singleton.Singleton;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ClienteDAO implements IDAO<Cliente> {

    @Override
    public boolean gravar(Cliente entidade, Conexao conexao) {
        String sql = """
                INSERT INTO CLIENTE(IDCLIENTE, NOME, CPF, TELEFONE, EMAIL)
                VALUES(NEXTVAL('seq_cliente'), '#2', '#3', '#4', '#5');
                """;
        sql = sql.replace("#2", entidade.getNome());
        sql = sql.replace("#3", entidade.getCpf());
        sql = sql.replace("#4", entidade.getTelefone());
        sql = sql.replace("#5", entidade.getEmail());
        return conexao.manipular(sql);
    }

    @Override
    public boolean alterar(Cliente entidade, int id, Conexao conexao) {
        return false;
    }

    public boolean alterar(Cliente entidade, String cpf,Conexao conexao) {
        String sql = """
                UPDATE CLIENTE
                SET NOME = '#1',
                    CPF = '#2',
                    TELEFONE = '#3',
                    EMAIL = '#4' WHERE CPF = '#5';
                """;
        sql = sql.replace("#1", entidade.getNome());
        sql = sql.replace("#2", entidade.getCpf());
        sql = sql.replace("#3", entidade.getTelefone());
        sql = sql.replace("#4", entidade.getEmail());
        sql = sql.replace("#5", "" + cpf);
        return conexao.manipular(sql);
    }

    public Cliente PegarCliente(String CPF, Conexao conexao) {
        Cliente cliente = null;
        String sql = "SELECT * FROM CLIENTE WHERE CPF = '" + CPF + "'";
        ResultSet rs = conexao.consultar(sql);

        try {
            if (rs.next()) {
                cliente = new Cliente(
                        rs.getString("NOME"),
                        rs.getString("CPF"),
                        rs.getString("TELEFONE"),
                        rs.getString("EMAIL"),
                        rs.getInt("IDCLIENTE")
                );
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return cliente;
    }

    @Override
    public boolean apagar(Cliente entidade, Conexao conexao) {
        return conexao.manipular("DELETE FROM CLIENTE WHERE CPF = '" + entidade.getCpf() + "'");
    }

    @Override
    public List<Cliente> pegarListaToda(Conexao conexao) {
        List<Cliente> clientes = new ArrayList<>();
        String sql = "SELECT * FROM CLIENTE";
        ResultSet rs = conexao.consultar(sql);
        try {
            while (rs.next())
            {
                clientes.add(new Cliente(
                        rs.getString("NOME"),
                        rs.getString("CPF"),
                        rs.getString("TELEFONE"),
                        rs.getString("EMAIL"),
                        rs.getInt("IDCLIENTE")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return clientes;
    }
}
