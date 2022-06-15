package com.musiclessonshub.model;

import lombok.*;

import javax.persistence.*;
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
    @JoinColumn(name = "chat_attachment_section_id")
    private ChatAttachmentSection chatAttachmentSectionId;

    @Column(name = "attachment_name")
    private String attachmentName;
}
