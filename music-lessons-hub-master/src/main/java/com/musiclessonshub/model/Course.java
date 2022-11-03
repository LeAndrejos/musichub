package com.musiclessonshub.model;

import lombok.*;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "courses", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @Column(name = "course_id")
    private UUID courseId;

    @Column
    private String title;
    @Column
    private String avatar;
    @Column
    private String description;
    @Column(name = "is_full_course")
    private boolean isFullCourse;
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

}
