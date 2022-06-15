package com.musiclessonshub.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;
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
    @ManyToOne
    @JoinColumn(name="parent_section_id")
    private Section parentSection;
    @JsonIgnore
    @OneToMany(mappedBy = "parentSection")
    private Set<Section> childSections;
}
