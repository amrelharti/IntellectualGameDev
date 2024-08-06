package com.example.intellectual_game.Controllers;

import com.example.intellectual_game.Entities.AnswerOperation;
import com.example.intellectual_game.services.AnswerOperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answer_operations")
public class AnswerOperationController {

    @Autowired
    private AnswerOperationService answerOperationService;

    @PostMapping
    public ResponseEntity<?> createAnswerOperation(@RequestBody AnswerOperation answerOperation) {
        try {
            AnswerOperation savedOperation = answerOperationService.createAnswerOperation(answerOperation);
            return ResponseEntity.ok(savedOperation);
        } catch (Exception e) {
            // Log the error for debugging purposes
            e.printStackTrace();
            // Return a detailed error response
            return ResponseEntity.badRequest().body("Error creating answer operation: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<AnswerOperation>> getAllAnswerOperations() {
        return ResponseEntity.ok(answerOperationService.getAllAnswerOperations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnswerOperation> getAnswerOperationById(@PathVariable String id) {
        return ResponseEntity.ok(answerOperationService.getAnswerOperationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnswerOperation> updateAnswerOperation(@PathVariable String id, @RequestBody AnswerOperation answerOperation) {
        return ResponseEntity.ok(answerOperationService.updateAnswerOperation(id, answerOperation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnswerOperation(@PathVariable String id) {
        answerOperationService.deleteAnswerOperation(id);
        return ResponseEntity.noContent().build();
    }
}
