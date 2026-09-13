package com.example.notification.config;

import com.example.notification.dto.NotificationEvent;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableKafka
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, NotificationEvent> kafkaConsumerFactory() {
        JsonDeserializer<NotificationEvent> notificationEventDeserializer =
                new JsonDeserializer<>(NotificationEvent.class, false);
        notificationEventDeserializer.addTrustedPackages("*");
        notificationEventDeserializer.setUseTypeHeaders(false);

        Map<String, Object> consumerProperties = new HashMap<>();
        consumerProperties.put(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        consumerProperties.put(
                ConsumerConfig.GROUP_ID_CONFIG, "notification-service");
        consumerProperties.put(
                ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumerProperties.put(
                ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        consumerProperties.put(
                ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(
                consumerProperties,
                new StringDeserializer(),
                notificationEventDeserializer
        );
    }

    @Bean("kafkaListenerContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, NotificationEvent>
    kafkaListenerContainerFactory(
            ConsumerFactory<String, NotificationEvent> consumerFactory) {

        ConcurrentKafkaListenerContainerFactory<String, NotificationEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}
