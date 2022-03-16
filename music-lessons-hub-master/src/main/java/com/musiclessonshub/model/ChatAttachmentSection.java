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
@Table(name = "chatattachmentsections", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatAttachmentSection {
    @Id
    @Column(name = "chat_attachment_section_id")
    private UUID chatAttachmentSectionId;
    @ManyToOne
    @JoinColumn(name="chat_id")
    private Chat chatId;

    @Column(name = "section_name")
    private String sectionName;

}
