package com.example.intellectual_game.dtos;

import com.example.intellectual_game.enums.GameState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

public class Request {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateGameRequest {
        private String playerId;
        private List<String> subjectsChosen;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AddPlayerRequest {
        private String gameId;
        private String playerId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateGameStateRequest {
        private String gameId;
        private GameState gameState;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpdateGameScoresRequest {
        private String gameId;
        private int scores;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SetWinnerRequest {
        private String gameId;
        private String playerId;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DeleteGameRequest {
        private String gameId;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChooseSubjectRequest {
        private String gameId;    // The ID of the game where the subject is being chosen
        private String playerId; // The ID of the player choosing the subject
        private String subject;  // The subject chosen by the player
    }
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JoinGameRequest {
        private String gameId;    // The ID of the game the player wants to join
        private String playerId; // The ID of the player who wants to join the game
    }
}
