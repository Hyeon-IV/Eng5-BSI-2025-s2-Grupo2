package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Parametrizacao;
import com.example.saodamiao.Model.TipoAlimento;
import com.example.saodamiao.Singleton.Conexao;
import com.example.saodamiao.Singleton.Singleton;

import java.io.Serializable;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ParametrizacaoDAO implements IDAO<Parametrizacao>{

    public String att ;

    public ParametrizacaoDAO(){

        this.att = "";
    }
    @Override
    public boolean gravar(Parametrizacao entidade, Conexao conexao) {
        String sql = "INSERT INTO parametrizacao (par_cnpj,par_razao_social,par_nome_fantasia,par_site,par_email,par_telefone,par_contato,par_rua,par_bairro,par_cidade,par_uf,par_cep,par_logo_grande,par_logo_pequeno)"+
                "VALUES ('"+entidade.getPar_cnpj()+"','"+entidade.getPar_razao_social()+"','"+entidade.getPar_nome_fantasia()+"','"+entidade.getPar_site()+"','"+entidade.getPar_email()+"','"+entidade.getPar_telefone()+"','"+entidade.getPar_contato()+"','"+entidade.getPar_rua()+"','"+entidade.getPar_bairro()+"','"+entidade.getPar_cidade()+"','"+entidade.getPar_uf()+"','"+entidade.getPar_cep()+"','"+entidade.getPar_logo_grande()+"','"+entidade.getPar_logo_pequeno()+"')";

            return conexao.manipular(sql);
    }
    @Override
    public boolean alterar(Parametrizacao entidade, int id, Conexao conexao) {
        return false;
    }
    @Override
    public boolean apagar(Parametrizacao entidade, Conexao conexao) {
        return false;
    }
    @Override
    public List<Parametrizacao> pegarListaToda(Conexao conexao) {

        List<Parametrizacao> lista = new ArrayList<>();
        String sql = "SELECT * FROM parametrizacao";
        ResultSet rs = conexao.consultar(sql);
        try{
            while(rs.next())
            {
                Parametrizacao P = new Parametrizacao(rs.getString("par_cnpj"),
                        rs.getString("par_razao_social"),
                        rs.getString("par_nome_fantasia"),
                        rs.getString("par_site"),
                        rs.getString("par_email"),
                        rs.getString("par_telefone"),
                        rs.getString("par_contato"),
                        rs.getString("par_rua"),
                        rs.getString("par_bairro"),
                        rs.getString("par_cidade"),
                        rs.getString("par_uf"),
                        rs.getString("par_cep"),
                        rs.getString("par_logo_grande"),
                        rs.getString("par_logo_pequeno"));

                lista.add(P);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return lista;
    }

    public Parametrizacao ResgatarTipo(String nome  , Conexao conexao) {
        Parametrizacao entidade = null;
        String sql =  "select * from parametrizacao where par_razao_sozial = '#2';";
        sql = sql.replace("#2", nome.toLowerCase());
        try{
            ResultSet rs = conexao.consultar(sql);
            if(rs.next()){
                entidade = new Parametrizacao();
                entidade.setPar_cnpj(rs.getString("par_cnpj"));
                entidade.setPar_razao_social(rs.getString("par_razao_social"));
                entidade.setPar_telefone(rs.getString("par_telefone"));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return entidade;
    }

    public Parametrizacao pegarParametro(Conexao conexao) {

        String sql = "SELECT * FROM parametrizacao ORDER BY par_cnpj";
        ResultSet rs = conexao.consultar(sql);
        try {
            if (!rs.next() || rs == null) {
                return null;
            }
            else
            {
                return new Parametrizacao(rs.getString("par_cnpj"),
                        rs.getString("par_razao_social"),
                        rs.getString("par_nome_fantasia"),
                        rs.getString("par_site"),
                        rs.getString("par_email"),
                        rs.getString("par_telefone"),
                        rs.getString("par_contato"),
                        rs.getString("par_rua"),
                        rs.getString("par_bairro"),
                        rs.getString("par_cidade"),
                        rs.getString("par_uf"),
                        rs.getString("par_cep"),
                        rs.getString("par_logo_grande"),
                        rs.getString("par_logo_pequeno"));
            }
        } catch (Exception e) {
            throw new RuntimeException(
                    "Erro consultando parametrizacao: " + e.getClass().getSimpleName() + " - " + e.getMessage(),
                    e
            );
        }
    }
}
