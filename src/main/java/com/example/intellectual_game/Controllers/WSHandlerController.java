package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.Entities.Question;
import com.example.intellectual_game.Repo.PlayerRepo;
import com.example.intellectual_game.enums.GameState;
import com.example.intellectual_game.services.GameService;
import com.example.intellectual_game.dtos.Request;
import com.example.intellectual_game.dtos.Response;
import com.example.intellectual_game.services.SinglePlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Controller
public class WSHandlerController {

    @Autowired
    private GameService gameService;
    @Autowired
    PlayerRepo playerRepository;
    @Autowired
    private SinglePlayerService singlePlayerService;

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



    @MessageMapping("/game.updateState")
    @SendTo("/topic/game.stateUpdated")
    public Response.GameStateUpdatedResponse updateGameState(Request.UpdateGameStateRequest request) {
        Game game = gameService.updateGameState(request.getGameId(), request.getGameState());
        return new Response.GameStateUpdatedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.updateScores")
    @SendTo("/topic/game.scoresUpdated")
    public Response.GameScoresUpdatedResponse updateGameScores(Request.UpdateGameScoresRequest request) {
        try {
            // Expect scores to be a Map<String, Integer>
            Map<String, Integer> scores = request.getScores(); // Ensure this is a Map, not an int

            // Call the service with the correct type
            Game game = gameService.updateGameScores(request.getGameId(), scores);

            // Handle potential null values
            int totalScores = game.getScores() != null ? game.getScores() : 0;

            return new Response.GameScoresUpdatedResponse(game.getId(), totalScores);
        } catch (Exception e) {
            logger.error("Error updating game scores", e);
            return new Response.GameScoresUpdatedResponse(request.getGameId(), 0); // Default to 0 in case of error
        }
    }


    @MessageMapping("/game.setWinner")
    @SendTo("/topic/game.winnerSet")
    public Response.GameWinnerSetResponse setWinner(Request.SetWinnerRequest request) {
        try {
            gameService.setWinner(request.getGameId(), request.getPlayerId());
            return new Response.GameWinnerSetResponse(request.getGameId(), request.getPlayerId());
        } catch (Exception e) {
            logger.error("Error setting winner", e);
            return new Response.GameWinnerSetResponse(request.getGameId(), null);
        }
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

    @MessageMapping("/lobby.ready")
    @SendTo("/topic/game.{gameId}.playerReady")
    public Response.PlayerReadyResponse markPlayerReady(Request.MarkReadyRequest request) {
        Game game = gameService.markPlayerReady(request.getGameId(), request.getPlayerId());
        boolean allPlayersReady = game.getReadyPlayers().size() == game.getPlayers().size();

        if (allPlayersReady) {
            game.setState(GameState.STARTING);
            gameService.updateGameState(game.getId(), GameState.STARTING);
            // Trigger game start
            startGame(new Request.StartGameRequest(game.getId()));
        }

        return new Response.PlayerReadyResponse();
    }

    @MessageMapping("/game.start")
    @SendTo("/topic/game.{gameId}.start")
    public Response.GameStartedResponse startGame(Request.StartGameRequest request) {
        Game game = gameService.startGame(request.getGameId());
        return new Response.GameStartedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.getAvailableSubjects")
    @SendToUser("/queue/responses")
    public Response.AvailableSubjectsResponse getAvailableSubjects() {
        List<String> subjects = singlePlayerService.getAvailableSubjects();
        return new Response.AvailableSubjectsResponse(subjects);
    }
    @MessageMapping("/game.createSinglePlayer")
    @SendToUser("/queue/responses")
    public Response.GameCreatedResponse createSinglePlayerGame(Request.CreateSinglePlayerRequest request) {
        Game game = singlePlayerService.createSinglePlayerGame(request.getPlayerId());
        return new Response.GameCreatedResponse(game.getId(), game.getState());
    }

    @MessageMapping("/game.getNextQuestion")
    @SendToUser("/queue/responses")
    public Response.NextQuestionResponse getNextQuestion(Request.NextQuestionRequest request) {
        Question question = singlePlayerService.getNextQuestion(request.getGameId());
        return new Response.NextQuestionResponse(question.getId(), question.getText(), question.getOptions());
    }

    @MessageMapping("/game.submitAnswer")
    @SendToUser("/queue/responses")
    public Response.AnswerSubmittedResponse submitSinglePlayerAnswer(Request.SubmitAnswerRequest request) {
        Game game = singlePlayerService.submitAnswer(request.getGameId(), request.getQuestionId(), request.getAnswer(), request.getAnswerType());
        return new Response.AnswerSubmittedResponse(game.getId(), game.getScores(), game.getState());
    }
}
