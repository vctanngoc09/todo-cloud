package edu.ut.todocloud.controller;

import edu.ut.todocloud.dto.request.TagRequest;
import edu.ut.todocloud.dto.response.TagResponse;
import edu.ut.todocloud.service.ITagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TagController {

    private final ITagService tagService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TagResponse>> getTagsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(tagService.getAllTagsByUserId(userId));
    }
    @GetMapping("/active/{userId}")
    public ResponseEntity<List<TagResponse>> getActiveTags(@PathVariable Long userId) {
        List<TagResponse> activeTags = tagService.getActiveTagsByUserId(userId);
        return ResponseEntity.ok(activeTags);
    }
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody TagRequest request) {
        return new ResponseEntity<>(tagService.createTag(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(@PathVariable Long id, @RequestBody TagRequest request) {
        return ResponseEntity.ok(tagService.updateTag(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

}