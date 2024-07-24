package com.example.intellectual_game.dtos;

import com.example.intellectual_game.enums.GameState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Response {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameCreatedResponse {
        private String gameId;
        private GameState gameState;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PlayerAddedResponse {
        private String gameId;
        private String playerId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameStateUpdatedResponse {
        private String gameId;
        private GameState gameState;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameScoresUpdatedResponse {
        private String gameId;
        private int scores;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameWinnerSetResponse {
        private String gameId;
        private String playerId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GameDeletedResponse {
        private String gameId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PlayerJoinedResponse {
        private String gameId;
        private String playerId;
        private String message; // Optional message, e.g., "Player joined successfully"
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubjectChosenResponse {
        private String gameId;
        private String playerId;
        private String subject;
        private String message; // Optional message, e.g., "Subject chosen successfully"
    }
}
