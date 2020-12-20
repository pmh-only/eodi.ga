create user eodiga@localhost;
create schema eodiga;

grant all privileges on eodiga.* to eodiga@localhost;
use eodiga;

create table shorts (
  id varchar(10) not null primary key,
  url text not null,
  captcha boolean default false not null,
  passwd boolean default false not null
);

create table cooldown (
  ip varchar(64) not null primary key,
  since timestamp default current_timestamp not null
);
