package com.example.saodamiao.Model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AlimentoEstoque {
    private long id_alimento;
    private LocalDate validade;
    private int quantidade;
}
