package edu.ut.todocloud.mapper;

import edu.ut.todocloud.dto.request.StickyNoteRequest;
import edu.ut.todocloud.dto.response.StickyNoteResponse;
import edu.ut.todocloud.model.StickyNote;
import edu.ut.todocloud.model.User;

public class StickyNoteMapper {

    public static StickyNote toEntity(StickyNoteRequest req, User user) {
        StickyNote note = new StickyNote();
        note.setTitle(req.getTitle());
        note.setText(req.getText());
        note.setColor(req.getColor());
        note.setUser(user);
        return note;
    }

    public static StickyNoteResponse toResponse(StickyNote note) {
        StickyNoteResponse res = new StickyNoteResponse();
        res.setId(note.getId());
        res.setTitle(note.getTitle());
        res.setText(note.getText());
        res.setColor(note.getColor());
        return res;
    }
}