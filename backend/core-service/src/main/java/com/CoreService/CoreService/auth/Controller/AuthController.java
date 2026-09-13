package com.CoreService.CoreService.auth.Controller;

import com.CoreService.CoreService.auth.Requests.*;
import com.CoreService.CoreService.auth.Response.LoginResponse;
import com.CoreService.CoreService.auth.Services.AuthService;
import com.CoreService.CoreService.auth.Services.RefreshTokenService;
import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.common.context.UserContext;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/core/auth")
public class AuthController {
   @Autowired
   private AuthService authService;
   @Autowired
   private UserContext userContext;
   @Autowired
   private  RefreshTokenService refreshTokenService;
   @PostMapping("/login")
   public ResponseEntity<LoginResponse> login(@RequestBody LoginRequests loginRequest) {
      try{
         LoginResponse loginResponse=authService.login(loginRequest);
         if(loginResponse==null)
         {return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                 .body(new LoginResponse("Invalid username or password"));
         }
         return ResponseEntity.ok(loginResponse);
      }
      catch (Exception e){
         e.printStackTrace();
         return ResponseEntity.badRequest().body(new LoginResponse("Invalid username or password"));
      }
   }
   @PutMapping("/logout")
   public ResponseEntity<BasicResponse> logout(@RequestBody RefreshTokenRequest refreshToken) {
      boolean isLogout= authService.logout(refreshToken.getRefreshToken());
      return ResponseEntity.ok(BasicResponse.builder().success(true).message("logout successfully").build());
   }
   @PostMapping("/refreshToken")
   public ResponseEntity<LoginResponse> updateRefreshTokenAndJwt(@RequestBody RefreshTokenRequest refreshToken){
      LoginResponse ans = authService.updateRefreshTokenAndJwt(refreshToken.getRefreshToken());
      return new ResponseEntity<>(ans, HttpStatus.OK);
   }
   @PostMapping("/forgotPasswordAndSendOtp")
   public ResponseEntity<BasicResponse> forgotPasswordAndSendOtp(@RequestBody ForgotPasswordRequest userId){
      authService.generateOtp(userId.getUserId());
      return ResponseEntity.ok(BasicResponse.builder().success(true).message("OTP sent successfully").build());
   }
   @PostMapping("/verifyOtp")
   public ResponseEntity<BasicResponse> verifyOtp(@RequestBody OtpRequest otpRequest){
      boolean isVerified= authService.checkOtp(otpRequest.getUserId(), otpRequest.getOtp());
      if(isVerified){
         return ResponseEntity.ok(BasicResponse.builder().success(true).message("OTP verified successfully").build());
      }
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(BasicResponse.builder().message("Invalid Otp or userId").build());
   }
   @PostMapping("/resetPassword")
   public ResponseEntity<BasicResponse> resetPassword(
           @RequestBody ResetPasswordRequest request) {

      authService.resetPassword(request);

      return ResponseEntity.ok(
              BasicResponse.builder()
                      .success(true)
                      .message("Password changed successfully")
                      .build()
      );
   }
}