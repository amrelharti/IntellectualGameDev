package com.example.intellectual_game.Exceptions;

public class Exception {
    public static class PlayerNotFoundException extends RuntimeException {
        public PlayerNotFoundException(String id) {
            super("Player not found: " + id);
        }
    }

    public class GameNotFoundException extends RuntimeException {
        public GameNotFoundException(String id) {
            super("Game not found: " + id);
        }
    }

    public class QuestionNotFoundException extends RuntimeException {
        public QuestionNotFoundException(String id) {
            super("Question not found: " + id);
        }
    }

    public class SubjectNotFoundException extends RuntimeException {
        public SubjectNotFoundException(String id) {
            super("Subject not found: " + id);
        }
    }

    public class GameFullException extends RuntimeException {
        public GameFullException(String gameId) {
            super("Game is full: " + gameId);
        }
    }

    public class NotEnoughPlayersException extends RuntimeException {
        public NotEnoughPlayersException(String gameId) {
            super("Not enough players to start the game: " + gameId);
        }
    }

    public class PlayerNotInGameException extends RuntimeException {
        public PlayerNotInGameException(String playerId, String gameId) {
            super("Player " + playerId + " is not in game " + gameId);
        }
    }

}
