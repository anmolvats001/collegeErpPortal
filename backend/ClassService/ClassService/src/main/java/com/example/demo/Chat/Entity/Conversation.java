package com.example.demo.Chat.Entity;

import com.example.demo.Class.Entities.ClassEntity;
import com.example.demo.common.BaseEntities.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "conversation",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_conversation_class",
                        columnNames = "class_id"
                )
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Conversation extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "class_id",
            nullable = false,
            unique = true
    )
    private ClassEntity classEntity;
}