package com.example.saodamiao.DAO;

import com.example.saodamiao.Model.Parametrizacao;
import com.example.saodamiao.Singleton.Singleton;

import java.io.Serializable;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ParametrizacaoDAO implements IDAO<Parametrizacao>{

    public String att ;

    public ParametrizacaoDAO(){

        this.att = "";
    }
    @Override
    public boolean gravar(Parametrizacao entidade) {
        String Par = "SELECT * FROM parametrizacao WHERE par_razao_social = "+entidade.getPar_razao_social();
        ResultSet rs = Singleton.Retorna().consultar(Par);
        try{
            if(rs.next() || !rs.next()){
                System.out.println("Erro ao consultar");
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        String sql = "INSERT INTO parametrizacao (par_cnpj,par_razao_social,par_nome_fantasia,par_site,par_email,par_telefone,par_contato,par_rua,par_bairro,par_cidade,par_uf,par_cep,par_logo_grande,par_logo_pequeno)"+
                "VALUES ('#1','#2','#3','#4','#5','#6','#7','#8','#9','#10','#11','#12','#13','#14')";
            sql = sql.replace("#1", ""+entidade.getPar_cnpj())
                    .replace("#2", ""+entidade.getPar_razao_social())
                    .replace("#3",""+entidade.getPar_nome_fantasia())
                    .replace("#4",""+entidade.getPar_site())
                    .replace("#5",""+entidade.getPar_email())
                    .replace("#6",""+entidade.getPar_telefone())
                    .replace("#7",""+entidade.getPar_contato())
                    .replace("#8",""+entidade.getPar_rua())
                    .replace("#9",""+entidade.getPar_bairro())
                    .replace("#10",""+entidade.getPar_cidade())
                    .replace("#11",""+entidade.getPar_uf())
                    .replace("#12",""+entidade.getPar_cep())
                    .replace("#13",""+entidade.getPar_logo_grande())
                    .replace("#14",""+entidade.getPar_logo_pequeno());

            return Singleton.Retorna().manipular(sql);
    }
    @Override
    public boolean alterar(Parametrizacao entidade, int id) {
        return false;
    }
    @Override
    public boolean apagar(Parametrizacao entidade) {
        return false;
    }
    @Override
    public List<Parametrizacao> pegarListaToda() {

        List<Parametrizacao> lista = new ArrayList<>();
        String sql = "SELECT * FROM parametrizacao";
        ResultSet rs = Singleton.Retorna().consultar(sql);
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

    public Parametrizacao pegarParametro() {

        Parametrizacao par = new Parametrizacao();
        String sql = "SELECT * FROM parametrizacao where par_cnpj = '1'";
        ResultSet rs = Singleton.Retorna().consultar(sql);
        try{
            if(rs.next())
            {
                par = new Parametrizacao(rs.getString("par_cnpj"),
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
            throw new RuntimeException(e);
        }
        return par;
    }
}
