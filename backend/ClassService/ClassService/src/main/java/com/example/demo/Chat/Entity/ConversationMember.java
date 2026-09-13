package com.example.demo.Chat.Entity;

import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "conversation_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_conversation_user",
                        columnNames = {
                                "conversation_id",
                                "user_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;

    @Column(
            name = "user_id",
            nullable = false
    )
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "member_type",
            nullable = false
    )
    private MemberType memberType;
}