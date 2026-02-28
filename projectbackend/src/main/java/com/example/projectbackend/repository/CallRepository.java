package com.example.projectbackend.repository;

import com.example.projectbackend.model.Call;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CallRepository extends JpaRepository<Call, Long> {
    List<Call> findByInitiatorId(Long initiatorId);
    List<Call> findByReceiverId(Long receiverId);
    List<Call> findByReceiverIdAndStatus(Long receiverId, Call.Status status);
}
