package com.example.saodamiao.Singleton;

public class Singleton {

    private static Conexao conexao = null;

    private Singleton() {
    }
    // obs: cada um tem seu banco atençao para conectar

    public static Conexao Retorna(){
        if(conexao == null){
            conexao = new Conexao();
            conexao.conectar("jdbc:postgresql://localhost/", "saodamiao","postgres","postgres123");;
        }
        return conexao;
    }


}
