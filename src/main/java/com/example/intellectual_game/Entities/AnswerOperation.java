package com.example.intellectual_game.Entities;

import com.example.intellectual_game.enums.AnswerType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "answer_operations")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnswerOperation {
    @Id
    private String id;
    private AnswerType answerType;
    private String answer; // The answer provided by the player
    private int score;

    @DBRef
    private Question question; // Reference to the question being answered
    private List<Player> players; // List of players involved in the answer operation
}
