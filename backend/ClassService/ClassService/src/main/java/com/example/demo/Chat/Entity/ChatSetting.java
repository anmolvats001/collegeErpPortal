package com.example.demo.Chat.Entity;

import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "chat_settings",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_chat_setting_conversation",
                        columnNames = "conversation_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ChatSetting extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "send_permission",
            nullable = false
    )
    private SendPermission sendPermission;

    public enum SendPermission {
        TEACHER_ONLY,
        ALL_MEMBERS
    }
}