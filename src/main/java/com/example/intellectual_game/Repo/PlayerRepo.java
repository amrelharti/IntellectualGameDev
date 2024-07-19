package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepo extends MongoRepository<Player, String> {
}
