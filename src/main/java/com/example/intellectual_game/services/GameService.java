package com.example.intellectual_game.services;

import com.example.intellectual_game.Entities.Game;
import com.example.intellectual_game.Repo.GameRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepo repository;

    public Game save(Game game) {
        return repository.save(game);
    }

    public List<Game> findAll() {
        return repository.findAll();
    }

    public Optional<Game> findById(String id) {
        return repository.findById(id);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }

}
