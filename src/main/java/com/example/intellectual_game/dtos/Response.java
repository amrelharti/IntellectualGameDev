package com.example.intellectual_game.dtos;

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
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PlayerReadyResponse {
        private String gameId;
        private String playerId;
        private List<String> readyPlayers;
        private List<String> allPlayers;
        private GameState gameState;
        private boolean allPlayersReady;
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

    @Data
    @AllArgsConstructor
    public static class QuestionReceivedResponse {
        private String question;
    }

    @Data
    @AllArgsConstructor
    public static class AnswerResultResponse {
        private boolean correct;
        private int points;
        private boolean isLastQuestion;
    }

    @Data
    @AllArgsConstructor
    public static class TurnEndedResponse {
        private String gameId;
        private String currentPlayer;
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GameUpdateResponse {
        private String gameId;
        private GameState gameState;
        private List<String> players;
        private List<String> readyPlayers;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextQuestionResponse {
        private String id;
        private String text;
        private List<String> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerSubmittedResponse {
        private String gameId;
        private int score;
        private GameState gameState;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvailableSubjectsResponse {
        private List<String> subjects;
    }
}