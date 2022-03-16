package com.musiclessonshub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "sections", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Section {
    @Id
    @Column(name="section_id")
    private UUID sectionId;
    @Column
    private String section_name;
    @Column
    private String description;
    @Column
    private int num_order;
    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;
}
