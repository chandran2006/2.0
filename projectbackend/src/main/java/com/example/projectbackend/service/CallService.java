package com.example.projectbackend.service;

import com.example.projectbackend.model.Call;
import com.example.projectbackend.repository.CallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CallService {
    
    private final CallRepository callRepository;
    
    public Call initiateCall(Long initiatorId, Long receiverId, String callType) {
        Call call = Call.builder()
                .initiatorId(initiatorId)
                .receiverId(receiverId)
                .callType(callType)
                .status(Call.Status.RINGING)
                .roomId(UUID.randomUUID().toString())
                .build();
        return callRepository.save(call);
    }
    
    public Call acceptCall(Long callId) {
        Call call = callRepository.findById(callId).orElseThrow();
        call.setStatus(Call.Status.ACCEPTED);
        return callRepository.save(call);
    }
    
    public Call rejectCall(Long callId) {
        Call call = callRepository.findById(callId).orElseThrow();
        call.setStatus(Call.Status.REJECTED);
        call.setEndedAt(LocalDateTime.now());
        return callRepository.save(call);
    }
    
    public Call endCall(Long callId) {
        Call call = callRepository.findById(callId).orElseThrow();
        call.setStatus(Call.Status.ENDED);
        call.setEndedAt(LocalDateTime.now());
        return callRepository.save(call);
    }
    
    public List<Call> getIncomingCalls(Long userId) {
        return callRepository.findByReceiverIdAndStatus(userId, Call.Status.RINGING);
    }
    
    public List<Call> getCallHistory(Long userId) {
        List<Call> initiated = callRepository.findByInitiatorId(userId);
        List<Call> received = callRepository.findByReceiverId(userId);
        initiated.addAll(received);
        return initiated;
    }
}
