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
import java.util.UUID;

@Entity
@Table(name = "attachments", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attachment {
    @Id
    @Column(name = "attachment_id")
    private UUID attachmentId;
    @Column
    private String type;
    @Column
    private String content;
    @ManyToOne
    @JoinColumn(name="section_id")
    private Section sectionId;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
