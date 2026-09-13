package com.CoreService.CoreService.auth.Services;

import com.CoreService.CoreService.College.Repository.CollegeRepository;
import com.CoreService.CoreService.Permission.Repository.PermissionRepository;
import com.CoreService.CoreService.Permission.Repository.RolePermissionRepository;
import com.CoreService.CoreService.auth.Entities.RefreshToken;
import com.CoreService.CoreService.auth.Repositories.RefreshTokenRepo;
import com.CoreService.CoreService.auth.Requests.LoginRequests;
import com.CoreService.CoreService.auth.Requests.ResetPasswordRequest;
import com.CoreService.CoreService.auth.Response.LoginResponse;
import com.CoreService.CoreService.common.DTO.JwtDto;
import com.CoreService.CoreService.common.JWT.JwtService;
import com.CoreService.CoreService.common.Redis.RedisService;
import com.CoreService.CoreService.module.Repository.CollegeModuleRepository;
import com.CoreService.CoreService.notification.NotificationProducer;
import com.CoreService.CoreService.module.Repository.ModuleRepository;
import com.CoreService.CoreService.role.Entities.UserRole;
import com.CoreService.CoreService.role.Repository.UserRoleRepository;
import com.CoreService.CoreService.user.Entities.UserEntity;
import com.CoreService.CoreService.user.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepo userRepository;
    private final CollegeRepository collegeRepository;
    private final CollegeModuleRepository collegeModuleRepository;
    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final ModuleRepository moduleRepository;
    private final PermissionRepository permissionRepository;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepo  refreshTokenRepo;
    private  final RedisService redisService;
    private final NotificationProducer notificationProducer;

    private static final String OTP_PREFIX = "OTP:";
    private static final Duration OTP_EXPIRY = Duration.ofMinutes(5);
    public LoginResponse login(LoginRequests request) {
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Invalid User ID or Password"));

        if (!Boolean.TRUE.equals(user.getActivate())) {
            throw new RuntimeException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid User ID or Password");
        }
        return generateLoginResponse(user);

       }
    public Boolean logout(String refreshToken) {
            RefreshToken token = refreshTokenRepo.findById(refreshToken)
                    .orElseThrow(() -> new RuntimeException("Invalid Refresh Token"));

            refreshTokenRepo.delete(token);

            return true;

    }

    public LoginResponse updateRefreshTokenAndJwt(String refreshToken) {
       Optional< RefreshToken> refreshToken1=refreshTokenRepo.findById(refreshToken);
        if (refreshToken1.isPresent()) {
            Boolean isExpired= refreshTokenService.checkExpiration(refreshToken1.get());
            UserEntity user = userRepository.findById(refreshToken1.get().getUserId())
                    .orElseThrow(() -> new RuntimeException("Invalid User ID or Password"));
            refreshTokenRepo.deleteById(refreshToken);
            if (isExpired) {
                throw new RuntimeException("Login again");
            }
            else return generateLoginResponse(user);
        }
        else {
            throw new RuntimeException("Invalid Refresh Token");
        }
    }
    public void generateOtp(String userId) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String email=user.getEmail();
        String otp = String.format("%06d", new Random().nextInt(1000000));

        redisService.save(
                OTP_PREFIX + userId,
                otp,
                OTP_EXPIRY
        );

        notificationProducer.send(
                email,
                "Campus Connect - Password Reset OTP",
                "Your password reset OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email."
        );

    }
    public boolean checkOtp(String userId, String otp) {

        Object storedOtp = redisService.get(OTP_PREFIX + userId);

        if (storedOtp == null) {
            throw new RuntimeException("OTP Expired");
        }

        if (!storedOtp.toString().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        redisService.delete(OTP_PREFIX + userId);

        redisService.save(
                "RESET:" + userId,
                true,
                Duration.ofMinutes(10)
        );

        return true;
    }
    public void resetPassword(ResetPasswordRequest request) {

        Object verified = redisService.get("RESET:" + request.getUserId());

        if (verified == null) {
            throw new RuntimeException("OTP Verification Required");
        }

        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        redisService.delete("RESET:" + request.getUserId());
    }
    public LoginResponse generateLoginResponse(UserEntity user) {

        UUID collegeId = user.getCollegeId();
        System.out.println("College Id: " + collegeId);

        List<UserRole> userRoles = userRoleRepository.findByUser(user);

        List<String> roles = userRoles.stream()
                .map(r -> r.getRole().getRoleName().toUpperCase())
                .distinct()
                .toList();

        boolean isMainAdmin = roles.contains("MAIN_ADMIN");

        List<String> permissions;
        List<String> modules;

        if (isMainAdmin) {
            collegeId=null;
            permissions = permissionRepository.findAll()
                    .stream()
                    .map(permission -> permission.getPermissionCode().toUpperCase())
                    .distinct()
                    .toList();

            modules = moduleRepository.findAll()
                    .stream()
                    .map(module -> module.getModuleCode().toUpperCase())
                    .distinct()
                    .toList();

        } else {

            permissions = userRoles.stream()
                    .flatMap(role ->
                            rolePermissionRepository
                                    .findAllByRole_roleId(role.getRole().getRoleId())
                                    .stream()
                    )
                    .map(rolePermission ->
                            rolePermission.getPermission().getPermissionCode().toUpperCase()
                    )
                    .distinct()
                    .toList();

            modules = collegeModuleRepository
                    .findByCollege_collegeIdAndEnabledTrue(collegeId)
                    .stream()
                    .map(collegeModule ->
                            collegeModule.getModule().getModuleCode().toUpperCase()
                    )
                    .distinct()
                    .toList();
        }
        RefreshToken refreshToken=refreshTokenService.generateRefreshToken(user.getUserId());
        JwtDto jwtDto = JwtDto.builder()
                .userId(user.getUserId())
                .collegeId(collegeId)
                .roles(roles)
                .permissions(permissions)
                .modules(modules)
                .build();


        String jwtToken = jwtService.generateJwtToken(jwtDto);

        return LoginResponse.builder()
                .jwtToken(jwtToken)
                .refreshToken(refreshToken.getId())
                .message("Login Successful")
                .build();

    }

}
