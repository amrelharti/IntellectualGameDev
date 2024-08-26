package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.dtos.Request;
import com.example.intellectual_game.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;


    @PostMapping("/signup")
    public ResponseEntity<Player> register(@RequestBody Player player) {
        Player newPlayer = playerService.createPlayer(player);
        return ResponseEntity.ok(newPlayer);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Request.LoginRequest loginRequest) {
        try {
            Player player = playerService.findByUsernameAndPassword(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(player);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
