package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.services.GameService;
import com.example.intellectual_game.dtos.Request;
import com.example.intellectual_game.dtos.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Controller
public class WSHandlerController extends TextWebSocketHandler {

    @Autowired
    private GameService gameService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/game.create")
    @SendTo("/topic/game.created")
    public Response.GameCreatedResponse createGame(Request.CreateGameRequest request) {
        Game game = gameService.createGame(request.getPlayerId(), request.getSubjectsChosen());
        return new Response.GameCreatedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.addPlayer")
    @SendTo("/topic/game.playerAdded")
    public Response.PlayerAddedResponse addPlayerToGame(Request.AddPlayerRequest request) {
        Game game = gameService.addPlayerToGame(request.getGameId(), request.getPlayerId());
        return new Response.PlayerAddedResponse(game.getId(), request.getPlayerId());
    }

    @MessageMapping("/game.updateState")
    @SendTo("/topic/game.stateUpdated")
    public Response.GameStateUpdatedResponse updateGameState(Request.UpdateGameStateRequest request) {
        Game game = gameService.updateGameState(request.getGameId(), request.getGameState());
        return new Response.GameStateUpdatedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.updateScores")
    @SendTo("/topic/game.scoresUpdated")
    public Response.GameScoresUpdatedResponse updateGameScores(Request.UpdateGameScoresRequest request) {
        Game game = gameService.updateGameScores(request.getGameId(), request.getScores());
        return new Response.GameScoresUpdatedResponse(game.getId(), game.getScores());
    }

    @MessageMapping("/game.setWinner")
    @SendTo("/topic/game.winnerSet")
    public Response.GameWinnerSetResponse setWinner(Request.SetWinnerRequest request) {
        Game game = gameService.setWinner(request.getGameId(), request.getPlayerId());
        return new Response.GameWinnerSetResponse(game.getId(), request.getPlayerId());
    }

    @MessageMapping("/game.delete")
    @SendTo("/topic/game.deleted")
    public Response.GameDeletedResponse deleteGame(Request.DeleteGameRequest request) {
        gameService.deleteGame(request.getGameId());
        return new Response.GameDeletedResponse(request.getGameId());
    }
    @MessageMapping("/game.join")
    @SendTo("/topic/game.joined")
    public Response.PlayerJoinedResponse joinGame(Request.JoinGameRequest request) {
        Game game = gameService.addPlayerToGame(request.getGameId(), request.getPlayerId());
        return Response.PlayerJoinedResponse.builder()
                .gameId(game.getId())
                .playerId(request.getPlayerId())
                .message("Player joined successfully")
                .build();
    }

    @MessageMapping("/game.chooseSubject")
    @SendTo("/topic/game.subjectChosen")
    public Response.SubjectChosenResponse chooseSubject(Request.ChooseSubjectRequest request) {
        Game game = gameService.chooseSubject(request.getGameId(), request.getPlayerId(), request.getSubject());
        return Response.SubjectChosenResponse.builder()
                .gameId(game.getId())
                .playerId(request.getPlayerId())
                .subject(request.getSubject())
                .message("Subject chosen successfully")
                .build();
    }
}
