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
@Table(name = "chatattachments", schema = "public")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatAttachment {
    @Id
    private UUID chat_attachment_id;
    @ManyToOne
    @JoinColumn(name="chat_attachment_section_id")
    private ChatAttachmentSection chatAttachmentSectionId;

    @Column(name = "attachment_name")
    private String attachmentName;
}
