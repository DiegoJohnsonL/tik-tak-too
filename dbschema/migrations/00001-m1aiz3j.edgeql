CREATE MIGRATION m1aiz3j5pg2jsecrjxhklldndolp45ks5zsrrcshj52mij6qs5ca3a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::User {
      CREATE PROPERTY created: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY updated: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY username: std::str;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id
      }
  )));
  CREATE TYPE default::Game {
      CREATE REQUIRED LINK createdBy: default::User;
      CREATE LINK prevPlayer: default::User;
      CREATE PROPERTY created: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY draw: std::bool;
      CREATE REQUIRED PROPERTY gameState: array<std::str> {
          SET default := (['', '', '', '', '', '', '', '', '']);
      };
      CREATE PROPERTY updated: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::GameMove {
      CREATE PROPERTY created: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE PROPERTY position: std::int16;
      CREATE PROPERTY symbol: std::str;
  };
  ALTER TYPE default::Game {
      CREATE LINK lastMove: default::GameMove;
  };
  CREATE TYPE default::PlayersHistory {
      CREATE REQUIRED LINK game: default::Game;
      CREATE REQUIRED LINK user: default::User;
      CREATE CONSTRAINT std::exclusive ON ((.user, .game));
  };
  ALTER TYPE default::Game {
      CREATE MULTI LINK playersHistory := (.<game[IS default::PlayersHistory]);
      CREATE LINK prevMove: default::GameMove;
  };
  ALTER TYPE default::GameMove {
      CREATE REQUIRED LINK playersHistory: default::PlayersHistory;
  };
  ALTER TYPE default::PlayersHistory {
      CREATE MULTI LINK moves := (.<playersHistory[IS default::GameMove]);
  };
};
