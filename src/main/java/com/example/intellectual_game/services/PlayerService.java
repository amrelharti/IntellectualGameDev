package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.Repo.PlayerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepo repository;

    public Player createPlayer(Player player) {
        return repository.save(player);
    }

    public Player findByUsernameAndPassword(String username, String password) {
        Optional<Player> player = repository.findByUsername(username);
        if (player.isPresent() && password.equals(player.get().getPassword())) {
            return player.get();
        }
        throw new RuntimeException("Invalid username or password");
    }

    public Optional<Player> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public Player save(Player player) {
        return repository.save(player);
    }

    public List<Player> findAll() {
        return repository.findAll();
    }

    public Optional<Player> findById(String id) {
        return repository.findById(id);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
}
