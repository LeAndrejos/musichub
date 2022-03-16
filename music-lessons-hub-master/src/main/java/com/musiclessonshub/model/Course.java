package com.musiclessonshub.model;

import org.codehaus.jackson.annotate.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.util.List;
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
    @Column(name="course_id")
    private UUID courseId;

    @Column
    private String title;
    @Column
    private String avatar;
    @Column
    private String description;
    @ManyToOne
    @JoinColumn(name="teacher_id")
    private User teacher;

}
