package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.enums.GameState;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepo extends MongoRepository<Game, String> {
    Game findFirstByState(GameState state);

    List<Game> findByState(GameState gameState);
}