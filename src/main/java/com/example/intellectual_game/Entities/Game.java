package com.example.intellectual_game.Entities;

import com.example.intellectual_game.enums.GameState;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "games")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Game {
    @Id
    private String id;
    private GameState state;
    private List<String> subjectsChosen;
    private int scores;

    @DBRef
    private List<AnswerOperation> answerOperations;

    @DBRef
    private Player winner;

    @DBRef
    private Player currentPlayer;

    @DBRef
    private List<String> players;


}
