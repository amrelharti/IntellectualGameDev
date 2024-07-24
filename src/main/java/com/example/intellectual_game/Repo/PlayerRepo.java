package com.example.intellectual_game.Repo;

import com.example.intellectual_game.Entities.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepo extends MongoRepository<Player, String> {
    Optional<Player> findByUsernameAndPassword(String username, String password);
    Optional<Player> findByUsername(String username);
}
