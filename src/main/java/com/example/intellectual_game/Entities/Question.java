package com.example.intellectual_game.Entities;

import com.example.intellectual_game.enums.QuestionType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Question {
    @Id
    private String id;
    private String text;
    private String correctAnswer;
    private QuestionType questionType;


    @DBRef
    private Subject subject;
    private AnswerOperation answerOperation;
}
