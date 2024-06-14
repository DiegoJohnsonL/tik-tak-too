using extension auth;

module default {

  type User {
    required username: str;
    created: datetime {
      rewrite insert using (datetime_of_statement());
    }
    updated: datetime {
      rewrite insert using (datetime_of_statement());
      rewrite update using (datetime_of_statement());
    }
  }

  type Game {
    required createdBy: User;
    lastMove: GameMove {
      constraint exclusive;
    }
    prevMove: GameMove {
      constraint exclusive;
    }
    prevPlayer: User;
    draw: bool;
    required gameState: array<str> {
      default := ["", "", "", "", "", "", "", "", ""];
    }
    multi playersHistory := (.<game[is PlayersHistory]);
    created: datetime {
      rewrite insert using (datetime_of_statement());
    }
    updated: datetime {
      rewrite insert using (datetime_of_statement());
      rewrite update using (datetime_of_statement());
    }
  }

  type PlayersHistory {
    multi moves := (.<playersHistory[is GameMove]);
    required user: User;
    required game: Game;
    constraint exclusive on ((.user, .game));
  }

  type GameMove {
    required playersHistory: PlayersHistory;
    symbol: str;
    position: int16;
    created: datetime {
      rewrite insert using (datetime_of_statement());
      }
    }
}