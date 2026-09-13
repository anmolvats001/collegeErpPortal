package com.example.demo.Chat.Entity;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Message extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "conversation_member_id",
            nullable = false
    )
    private ConversationMember conversationMember;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "message_type",
            nullable = false
    )
    private MessageType messageType;

    @Column(
            name = "message",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String message;

    public enum MessageType {
        TEXT,
        IMAGE,
        FILE
    }
}