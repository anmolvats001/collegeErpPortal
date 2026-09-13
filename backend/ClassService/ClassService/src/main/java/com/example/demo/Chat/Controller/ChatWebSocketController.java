package com.example.demo.Chat.Controller;
import com.example.demo.Chat.Request.MessageRequest;
import com.example.demo.Chat.Response.MessageResponse;
import com.example.demo.Chat.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @PreAuthorize("hasAuthority('SEND_MESSAGE')")
    @MessageMapping("/chat.send")
    public void sendMessage(
            MessageRequest request,
            Principal principal
    ) {

        System.out.println(
                "WebSocket user = "
                        + principal.getName()
        );

        MessageResponse response =
                messageService.sendMessage(request);

        messagingTemplate.convertAndSend(
                "/topic/conversation/"
                        + request.getConversationId(),
                response
        );
    }
}