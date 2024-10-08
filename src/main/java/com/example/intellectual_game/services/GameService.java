package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.enums.GameState;
import com.example.intellectual_game.Repo.GameRepo;
import com.example.intellectual_game.Repo.PlayerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    @Autowired
    private GameRepo gameRepository;

    @Autowired
    private PlayerRepo playerRepository;

    public Game createGame(String playerId, List<String> subjectsChosen) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));

        Game game = new Game();
        game.setState(GameState.waitingForPlayers);
        game.setSubjectsChosen(subjectsChosen);
        game.setScores(0);
        game.setCurrentPlayer(player);
        game.setPlayers(List.of(playerId));
        game.setAnswerOperations(List.of());

        return gameRepository.save(game);
    }

    public Game addPlayerToGame(String gameId, String playerId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        game.getPlayers().add(playerId);
        return gameRepository.save(game);
    }

    public Game updateGameState(String gameId, GameState gameState) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        game.setState(gameState);
        return gameRepository.save(game);
    }

    public Game updateGameScores(String gameId, int scores) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        game.setScores(scores);
        return gameRepository.save(game);
    }

    public Game setWinner(String gameId, String playerId) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));
        game.setWinner(player);
        return gameRepository.save(game);
    }

    public void deleteGame(String gameId) {
        gameRepository.deleteById(gameId);
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(String gameId) {
        return gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
    }

    public Game chooseSubject(String gameId, String playerId, String subject) {
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new RuntimeException("Game not found"));
        // Add logic to handle subject choice
        return gameRepository.save(game);
    }
}
