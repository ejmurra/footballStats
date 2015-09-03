CREATE TABLE player
(
  name text,
  team text,
  pick_num integer,
  year_drafted character varying(4),
  id integer NOT NULL,
  CONSTRAINT player_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
CREATE TABLE game
(
  player integer NOT NULL,
  season character varying(4) NOT NULL,
  week integer NOT NULL,
  date character varying,
  g integer,
  gs integer,
  passing_comp integer,
  passing_att integer,
  passing_pct real,
  passing_yds real,
  passing_avg real,
  passing_td integer,
  passing_int integer,
  passing_sck integer,
  passing_scky real,
  passing_rate real,
  rushing_att integer,
  rushing_yds real,
  rushing_avg real,
  rushing_td integer,
  fumbles integer,
  fumbles_lost integer,
  CONSTRAINT game_pk PRIMARY KEY (player, season, week),
  CONSTRAINT player_fk FOREIGN KEY (player)
      REFERENCES player (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);