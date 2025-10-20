-- =====================================================
-- postgresql ddl (minúsculas, sem aspas, schema public)
-- =====================================================

-- garantir o schema padrão nesta sessão
set search_path to public;

-- limpeza idempotente
drop table if exists agendamento_entrega cascade;
drop table if exists alimentos cascade;
drop table if exists beneficiario cascade;
drop table if exists caixa cascade;
drop table if exists cliente cascade;
drop table if exists colaborador cascade;
drop table if exists doacao cascade;
drop table if exists entrada_doacao cascade;
drop table if exists estoque_alimento cascade;
drop table if exists funcionario cascade;
drop table if exists gestor cascade;
drop table if exists inspecao_alimento cascade;
drop table if exists inspecao_bazar cascade;
drop table if exists item_entrada_doacao cascade;
drop table if exists itens_doacao cascade;
drop table if exists item_bazar cascade;
drop table if exists itens_cesta cascade;
drop table if exists itens_venda cascade;
drop table if exists login cascade;
drop table if exists permissao_usuario cascade;
drop table if exists parametrizacao cascade;
drop table if exists permissao cascade;
drop table if exists tipo_alimento cascade;
drop table if exists tipo_bazar cascade;
drop table if exists tipo_cesta_basica cascade;
drop table if exists vendas cascade;
drop table if exists voluntario cascade;

-- =====================
-- 1) tabelas base
-- =====================

create table colaborador (
  idcolaborador int not null,
  nome varchar(45) not null,
  cpf varchar(45) not null,
  dt_mat date not null,
  telefone varchar(14) not null,
  email varchar(60) not null,
  rua varchar(40) not null,
  bairro varchar(40) not null,
  cidade varchar(40) not null,
  uf varchar(2) not null,
  cep varchar(9) not null,
  primary key (idcolaborador)
);

create table beneficiario (
  idbeneficiario int not null,
  cpf varchar(14) not null,
  nome varchar(40) not null,
  endereco varchar(40) not null,
  email varchar(60) not null,
  data_cadastro date not null,
  bairro varchar(40) not null,
  cidade varchar(40) not null,
  uf varchar(2) not null,
  cep varchar(9) not null,
  telefone varchar(14) not null,
  primary key (idbeneficiario)
);

create table cliente (
  idcliente int not null,
  nome varchar(40) not null,
  cpf varchar(14) not null,
  telefone varchar(14) not null,
  email varchar(40) not null,
  primary key (idcliente)
);

create table tipo_alimento (
  tpa_id int DEFAULT nextval('seq_tipo_alimento'),
  tpa_desc varchar(20) not null,
  primary key (tpa_id)
);

create table tipo_bazar (
  tpb_id int not null,
  tpb_desc varchar(45) not null,
  primary key (tpb_id)
);

create table tipo_cesta_basica (
  idcestas_basicas int not null,
  tamanho varchar(20) not null,
  primary key (idcestas_basicas)
);

create table permissao (
  idpermissao int not null,
  tipo_permissao varchar(30) not null,
  ativo varchar(1) not null,
  primary key (idpermissao)
);

create table parametrizacao (
  par_cnpj varchar(18) not null,
  par_razao_social varchar(60) not null,
  par_nome_fantasia varchar(45) not null,
  par_site varchar(80) not null,
  par_email varchar(60) not null,
  par_telefone varchar(14) not null,
  par_contato varchar(45) not null,
  par_rua varchar(45) not null,
  par_bairro varchar(45) not null,
  par_cidade varchar(45) not null,
  par_uf varchar(2) not null,
  par_cep varchar(45) not null,
  par_logo_grande varchar(100) not null,
  par_logo_pequeno varchar(100) not null,
  primary key (par_cnpj)
);

-- =========================
-- 2) tabelas dependentes
-- =========================

create table login (
  colaborador_idcolaborador int not null,
  log_username varchar(10) not null,
  log_ativo varchar(1) not null,
  log_senha varchar(10) not null,
  primary key (colaborador_idcolaborador),
  constraint fk_login_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

create table caixa (
  idcaixa int not null,
  data_abertura timestamp not null,
  valor_abertura double precision not null,
  login_abertura int not null,
  data_fechamento timestamp not null,
  valor_fechamento double precision not null,
  login_fechamento int not null,
  primary key (idcaixa),
  constraint fk_caixa_login1
    foreign key (login_abertura)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action,
  constraint fk_caixa_login2
    foreign key (login_fechamento)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action
);

create table doacao (
  iddoacao int not null,
  data date not null,
  descricao varchar(45),
  beneficiario_idbeneficiario int not null,
  colaborador_idcolaborador int not null,
  primary key (iddoacao),
  constraint fk_doacao_beneficiario1
    foreign key (beneficiario_idbeneficiario)
    references beneficiario (idbeneficiario)
    on delete no action
    on update no action,
  constraint fk_doacao_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

create table agendamento_entrega (
  idagendamento_entrega int not null,
  data_entrega timestamp not null,
  doacao_iddoacao int not null,
  login_colaborador_idcolaborador int not null,
  colaborador_idcolaborador int not null,
  primary key (idagendamento_entrega),
  constraint fk_agendamento_entrega_doacao1
    foreign key (doacao_iddoacao)
    references doacao (iddoacao)
    on delete no action
    on update no action,
  constraint fk_agendamento_entrega_login1
    foreign key (login_colaborador_idcolaborador)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action,
  constraint fk_agendamento_entrega_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

create table alimentos (
  idalimentos int not null,
  nome varchar(45) not null,
  tipo_alimento_tpa_id int not null,
  primary key (idalimentos),
  CONSTRAINT uk_alimentos_nome UNIQUE (nome),
  constraint fk_alimentos_tipo_alimento1
    foreign key (tipo_alimento_tpa_id)
    references tipo_alimento (tpa_id)
    on delete no action
    on update no action
);

create table entrada_doacao (
  end_id int not null,
  end_data date not null,
  nome_doador varchar(40),
  telefone_doador varchar(40),
  login_colaborador_idcolaborador int not null,
  primary key (end_id),
  constraint fk_entrada_doacao_login1
    foreign key (login_colaborador_idcolaborador)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action
);

create table estoque_alimento (
  alimentos_idalimentos int not null,
  esa_validade date not null,
  esa_qtde int not null,
  primary key (alimentos_idalimentos, esa_validade),
  constraint fk_estoque_alimento_alimentos1
    foreign key (alimentos_idalimentos)
    references alimentos (idalimentos)
    on delete no action
    on update no action
);

create table funcionario (
  idfuncionario int not null,
  colaborador_idcolaborador int not null,
  func_data_admissao date not null,
  func_data_demissao date,
  salario_atual double precision not null,
  primary key (idfuncionario, colaborador_idcolaborador),
  constraint fk_funcionario_colaborador
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

create table gestor (
  idgestor int not null,
  colaborador_idcolaborador int not null,
  data_inicio date not null,
  data_fim date,
  salario double precision not null,
  primary key (idgestor, colaborador_idcolaborador),
  constraint fk_gestor_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

create table inspecao_alimento (
  insa_id int not null,
  insa_data date not null,
  insa_obs varchar(100) not null,
  alimentos_idalimentos int not null,
  login_colaborador_idcolaborador int not null,
  primary key (insa_id),
  constraint fk_inspecao_alimento_alimentos1
    foreign key (alimentos_idalimentos)
    references alimentos (idalimentos)
    on delete no action
    on update no action,
  constraint fk_inspecao_alimento_login1
    foreign key (login_colaborador_idcolaborador)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action
);

create table item_bazar (
  iditem_bazar int not null,
  nome varchar(45) not null,
  qtde int not null,
  condicaoitem varchar(40) not null,
  preco double precision not null,
  tipo_bazar_tpb_id int not null,
  primary key (iditem_bazar),
  constraint fk_item_bazar_tipo_bazar1
    foreign key (tipo_bazar_tpb_id)
    references tipo_bazar (tpb_id)
    on delete no action
    on update no action
);

create table inspecao_bazar (
  insb_id int not null,
  insb_data date not null,
  insb_obs varchar(100) not null,
  item_bazar_iditem_bazar int not null,
  login_colaborador_idcolaborador int not null,
  primary key (insb_id),
  constraint fk_inspecao_bazar_item_bazar1
    foreign key (item_bazar_iditem_bazar)
    references item_bazar (iditem_bazar)
    on delete no action
    on update no action,
  constraint fk_inspecao_bazar_login1
    foreign key (login_colaborador_idcolaborador)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action
);

create table item_entrada_doacao (
  ite_id int not null,
  entrada_doacao_end_id int not null,
  item_bazar_iditem_bazar int not null,
  alimentos_idalimentos int not null,
  ite_qtde int not null,
  primary key (ite_id),
  constraint fk_item_entrada_doacao_item_bazar1
    foreign key (item_bazar_iditem_bazar)
    references item_bazar (iditem_bazar)
    on delete no action
    on update no action,
  constraint fk_item_entrada_doacao_alimentos1
    foreign key (alimentos_idalimentos)
    references alimentos (idalimentos)
    on delete no action
    on update no action,
  constraint fk_item_entrada_doacao_entrada_doacao1
    foreign key (entrada_doacao_end_id)
    references entrada_doacao (end_id)
    on delete no action
    on update no action
);

create table itens_cesta (
  cestas_basicas_idcestas_basicas int not null,
  alimentos_idalimentos int not null,
  qtde int not null,
  primary key (cestas_basicas_idcestas_basicas, alimentos_idalimentos),
  constraint fk_cestas_basicas_has_alimentos_cestas_basicas1
    foreign key (cestas_basicas_idcestas_basicas)
    references tipo_cesta_basica (idcestas_basicas)
    on delete no action
    on update no action,
  constraint fk_cestas_basicas_has_alimentos_alimentos1
    foreign key (alimentos_idalimentos)
    references alimentos (idalimentos)
    on delete no action
    on update no action
);

create table itens_doacao (
  idoa_id int not null,
  doacao_iddoacao int not null,
  tipo_cesta_basica_idcestas_basicas int,
  item_bazar_iditem_bazar int,
  primary key (idoa_id, doacao_iddoacao),
  constraint fk_itens_doacao_doacao1
    foreign key (doacao_iddoacao)
    references doacao (iddoacao)
    on delete no action
    on update no action,
  constraint fk_itens_doacao_tipo_cesta_basica1
    foreign key (tipo_cesta_basica_idcestas_basicas)
    references tipo_cesta_basica (idcestas_basicas)
    on delete no action
    on update no action,
  constraint fk_itens_doacao_item_bazar1
    foreign key (item_bazar_iditem_bazar)
    references item_bazar (iditem_bazar)
    on delete no action
    on update no action
);

create table vendas (
  idvenda int not null,
  data_venda date not null,
  valor double precision not null,
  cliente_idcliente int not null,
  login_colaborador_idcolaborador int not null,
  valor_pago double precision not null,
  tipo_pagamento varchar(10) not null,
  caixa_idcaixa int not null,
  primary key (idvenda),
  constraint fk_vendas_cliente1
    foreign key (cliente_idcliente)
    references cliente (idcliente)
    on delete no action
    on update no action,
  constraint fk_vendas_login1
    foreign key (login_colaborador_idcolaborador)
    references login (colaborador_idcolaborador)
    on delete no action
    on update no action,
  constraint fk_vendas_caixa1
    foreign key (caixa_idcaixa)
    references caixa (idcaixa)
    on delete no action
    on update no action
);

create table itens_venda (
  item_bazar_iditem_bazar int not null,
  item_bazar_doacao_iddoacao int not null,
  vendas_idvenda int not null,
  qtde int not null,
  valor double precision not null,
  primary key (item_bazar_iditem_bazar, item_bazar_doacao_iddoacao, vendas_idvenda),
  constraint fk_item_bazar_has_vendas_item_bazar1
    foreign key (item_bazar_iditem_bazar)
    references item_bazar (iditem_bazar)
    on delete no action
    on update no action,
  constraint fk_item_bazar_has_vendas_vendas1
    foreign key (vendas_idvenda)
    references vendas (idvenda)
    on delete no action
    on update no action
);

create table permissao_usuario (
  colaborador_idcolaborador int not null,
  gestor_idgestor int not null,
  gestor_colaborador_idcolaborador int not null,
  permissao_idpermissao int not null,
  data_inicio date not null,
  data_fim date,
  primary key (colaborador_idcolaborador, gestor_idgestor, gestor_colaborador_idcolaborador, permissao_idpermissao),
  constraint fk_table1_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action,
  constraint fk_table1_gestor1
    foreign key (gestor_idgestor, gestor_colaborador_idcolaborador)
    references gestor (idgestor, colaborador_idcolaborador)
    on delete no action
    on update no action,
  constraint fk_table1_permissao1
    foreign key (permissao_idpermissao)
    references permissao (idpermissao)
    on delete no action
    on update no action
);

create table voluntario (
  idvoluntario int not null,
  colaborador_idcolaborador int not null,
  data_inicio date not null,
  data_fim date,
  primary key (idvoluntario, colaborador_idcolaborador),
  constraint fk_voluntario_colaborador1
    foreign key (colaborador_idcolaborador)
    references colaborador (idcolaborador)
    on delete no action
    on update no action
);

-- =========================
-- sequences (estilo simples)
-- =========================

create sequence seq_colaborador start with 1 increment by 1;
create sequence seq_beneficiario start with 1 increment by 1;
create sequence seq_cliente start with 1 increment by 1;
create sequence seq_tipo_alimento start with 1 increment by 1;
create sequence seq_tipo_bazar start with 1 increment by 1;
create sequence seq_tipo_cesta_basica start with 1 increment by 1;
create sequence seq_permissao start with 1 increment by 1;
create sequence seq_caixa start with 1 increment by 1;
create sequence seq_doacao start with 1 increment by 1;
create sequence seq_agendamento_entrega start with 1 increment by 1;
create sequence seq_alimentos start with 1 increment by 1;
create sequence seq_entrada_doacao start with 1 increment by 1;
create sequence seq_funcionario start with 1 increment by 1;
create sequence seq_gestor start with 1 increment by 1;
create sequence seq_inspecao_alimento start with 1 increment by 1;
create sequence seq_item_bazar start with 1 increment by 1;
create sequence seq_inspecao_bazar start with 1 increment by 1;
create sequence seq_item_entrada_doacao start with 1 increment by 1;
create sequence seq_itens_doacao start with 1 increment by 1;
create sequence seq_vendas start with 1 increment by 1;
create sequence seq_voluntario start with 1 increment by 1;

-- fim
