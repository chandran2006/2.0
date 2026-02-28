package com.example.projectbackend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calls")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Call {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long initiatorId;
    private Long receiverId;
    private String callType;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.RINGING;
    
    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime endedAt;
    private String roomId;
    private Long duration;
    
    public enum Status {
        RINGING, ACCEPTED, REJECTED, ENDED
    }
}
