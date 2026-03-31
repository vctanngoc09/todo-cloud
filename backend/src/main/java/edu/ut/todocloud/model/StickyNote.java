package edu.ut.todocloud.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sticky_notes")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class StickyNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(nullable = true)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}