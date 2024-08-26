package com.example.intellectual_game.dtos;

import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.enums.GameState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
        private List<String> players;
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
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PlayerReadyResponse {
        private String gameId;
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class GameStartedResponse {
        private String gameId;
        private GameState gameState;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class GameWaitingResponse {
        private String gameId;
        private GameState state;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class AutoJoinResponse {
        private String gameId;
        private GameState gameState;
        private List<String> players;
        private String message;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PlayerNameResponse {
        private String playerId;
        private String username;
    }
}
