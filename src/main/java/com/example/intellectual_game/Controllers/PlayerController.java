package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.Player;
import com.example.intellectual_game.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/register")
    public Player register(@RequestBody Player player) {
        return playerService.createPlayer(player);
    }

    @GetMapping("/login")
    public Player login(@RequestParam String username, @RequestParam String password) {
        return playerService.findByUsernameAndPassword(username, password);
    }
}
