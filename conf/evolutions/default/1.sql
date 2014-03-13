
# --- !Ups

create table account (
  id                        bigint not null,
  email                     varchar(255) not null,
  name                      varchar(255),
  password                  varchar(255),
  constraint pk_account primary key (id)
);

create table projects (
  id                        bigint not null,
  name                     varchar(255),
  description               varchar(255),
  create_date               timestamp,
  user_id                   bigint,
  constraint pk_projects primary key (id),
  foreign key (user_id) references account (id)
);

create sequence account_seq start with 1000;
create sequence projects_seq start with 1000;


# --- !Downs
drop table if exists projects;
drop sequence if exists projects_seq;

drop table if exists account;
drop sequence if exists account_seq;





