package com.CoreService.CoreService.common.Redis;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core
        .RedisTemplate;

import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, Object>
            redisTemplate;

    public void save(
            String key,
            Object value,
            Duration ttl
    ) {

        redisTemplate
                .opsForValue()
                .set(
                        key,
                        value,
                        ttl
                );
    }


    public Object get(
            String key
    ) {

        Object value =
                redisTemplate
                        .opsForValue()
                        .get(key);

        if (value == null) {

            return null;
        }

        return value;
    }

    public void delete(String key) {

        redisTemplate.delete(key);
    }


    public boolean exists(String key) {

        Boolean exists =
                redisTemplate.hasKey(key);

        return Boolean.TRUE.equals(exists);
    }
}
