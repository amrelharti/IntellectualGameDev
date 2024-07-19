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
    private String answer;
    private int score;

    @DBRef
    private Question question; // one to one
    private List<Player> players; // One To Many

}
