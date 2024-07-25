/*package com.example.intellectual_game.Controllers.;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.enums.GameState;
import com.example.intellectual_game.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/create")
    public Game createGame(@RequestParam String playerId, @RequestBody List<String> subjectsChosen) {
        return gameService.createGame(playerId, subjectsChosen);
    }

    @PostMapping("/{gameId}/addPlayer")
    public Game addPlayerToGame(@PathVariable String gameId, @RequestParam String playerId) {
        return gameService.addPlayerToGame(gameId, playerId);
    }

    @PutMapping("/{gameId}/state")
    public Game updateGameState(@PathVariable String gameId, @RequestParam GameState gameState) {
        return gameService.updateGameState(gameId, gameState);
    }

    @GetMapping("/{gameId}")
    public Optional<Game> getGameById(@PathVariable String gameId) {
        return gameService.getGameById(gameId);
    }

    @GetMapping("/")
    public List<Game> getAllGames() {
        return gameService.getAllGames();
    }

    @PutMapping("/{gameId}/scores")
    public Game updateGameScores(@PathVariable String gameId, @RequestParam int scores) {
        return gameService.updateGameScores(gameId, scores);
    }

    @PutMapping("/{gameId}/winner")
    public Game setWinner(@PathVariable String gameId, @RequestParam String playerId) {
        return gameService.setWinner(gameId, playerId);
    }

    @DeleteMapping("/{gameId}")
    public void deleteGame(@PathVariable String gameId) {
        gameService.deleteGame(gameId);
    }
}
*/