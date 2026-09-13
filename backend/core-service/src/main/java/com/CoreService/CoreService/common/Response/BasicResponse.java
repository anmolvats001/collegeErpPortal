package com.CoreService.CoreService.common.Response;

import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class BasicResponse {
    String message;
    Boolean success;
}
