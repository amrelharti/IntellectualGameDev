package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.Repo.PlayerRepo;
import com.example.intellectual_game.enums.GameState;
import com.example.intellectual_game.services.GameService;
import com.example.intellectual_game.dtos.Request;
import com.example.intellectual_game.dtos.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

@Controller
public class WSHandlerController {

    @Autowired
    private GameService gameService;
    @Autowired
    PlayerRepo playerRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private static final Logger logger = LoggerFactory.getLogger(WSHandlerController.class);


    @MessageMapping("/game.create")
    @SendTo("/topic/game.created")
    public Response.GameCreatedResponse createGame(Request.CreateGameRequest request) {
        Game game = gameService.createGame(request.getPlayerId(), request.getSubjectsChosen());
        messagingTemplate.convertAndSend("/topic/game.waiting", new Response.GameWaitingResponse(game.getId(), game.getState()));
        return new Response.GameCreatedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.addPlayer")
    @SendTo("/topic/game.playerAdded")
    public Response.PlayerAddedResponse addPlayerToGame(Request.AddPlayerRequest request) {
        Game game = gameService.addPlayerToGame(request.getGameId(), request.getPlayerId());

        if (game.getState() == GameState.WAITING_FOR_PLAYERS) {
            messagingTemplate.convertAndSend("/topic/game.waiting", new Response.GameWaitingResponse(game.getId(), game.getState()));
        }

        return new Response.PlayerAddedResponse(game.getId(), request.getPlayerId());
    }

    @MessageMapping("/game.markReady")
    @SendTo("/topic/game.ready")
    public Response.PlayerReadyResponse markPlayerReady(Request.MarkReadyRequest request) {
        Game game = gameService.markPlayerReady(request.getGameId(), request.getPlayerId());
        return new Response.PlayerReadyResponse(game.getId(), request.getPlayerId());
    }

    @MessageMapping("/game.start")
    @SendTo("/topic/game.started")
    public Response.GameStartedResponse startGame(Request.StartGameRequest request) {
        Game game = gameService.startGame(request.getGameId());
        return new Response.GameStartedResponse(game.getId(), game.getState());
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

    @MessageMapping("/game.autoJoin")
    @SendToUser("/queue/responses")
    public Response.AutoJoinResponse autoJoinGame(Request.AutoJoinRequest request) {
        logger.info("Received autoJoinGame request for player: {}", request.getPlayerId());
        try {
            Game game = gameService.findWaitingGame();
            boolean isNewGame = false;
            if (game != null) {
                logger.info("Found waiting game: {}", game.getId());
                game = gameService.addPlayerToGame(game.getId(), request.getPlayerId());
            } else {
                logger.info("Creating new game for player: {}", request.getPlayerId());
                game = gameService.createGame(request.getPlayerId(), Collections.emptyList());
                isNewGame = true;
            }

            logger.info("Auto-join successful. Game ID: {}, State: {}, Players: {}", game.getId(), game.getState(), game.getPlayers());

            // Broadcast player joined event to all clients
            messagingTemplate.convertAndSend("/topic/game." + game.getId() + ".playerJoined",
                    new Response.PlayerJoinedResponse(game.getId(), request.getPlayerId(), game.getPlayers()));

            if (isNewGame) {
                messagingTemplate.convertAndSend("/topic/game.created",
                        new Response.GameCreatedResponse(game.getId(), game.getState()));
            }

            return new Response.AutoJoinResponse(game.getId(), game.getState(), game.getPlayers(), "Successfully joined/created game");
        } catch (Exception e) {
            logger.error("Error in autoJoinGame", e);
            return new Response.AutoJoinResponse(null, null, null, "Failed to auto-join game: " + e.getMessage());
        }
    }

    @MessageMapping("/getPlayerName")
    @SendToUser("/queue/playerName")
    public Response.PlayerNameResponse getPlayerName(Request.PlayerNameRequest request) {
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found"));
        return new Response.PlayerNameResponse(player.getId(), player.getUsername()); // Ensure the response has username
    }

}
