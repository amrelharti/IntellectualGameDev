package com.example.intellectual_game.dtos;

import com.example.intellectual_game.enums.GameState;
import lombok.*;
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
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;

    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MarkReadyRequest {
        private String gameId;
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StartGameRequest {
        private String gameId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LobbyCreationRequest {
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LobbyJoinRequest {
        private String lobbyId;
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ReadyRequest {
        private String lobbyId;
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StartRequest {
        private String lobbyId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AutoJoinRequest {
        private String playerId;
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PlayerNameRequest {
        private String playerId;

    }

}
