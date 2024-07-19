package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepo extends MongoRepository<Game, String> {
}
