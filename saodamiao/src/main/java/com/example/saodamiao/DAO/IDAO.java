package com.example.saodamiao.DAO;


import java.util.List;

public interface IDAO <T>{

    public boolean gravar(T entidade);
    public boolean alterar(T entidade, int id);
    public boolean apagar(T entidade);
    public List<T> pegarListaToda();
}
