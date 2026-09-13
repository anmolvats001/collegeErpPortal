package com.CoreService.CoreService.user.Services;

import com.CoreService.CoreService.College.Repository.CollegeRepository;
import com.CoreService.CoreService.common.context.CollegeContext;
import com.CoreService.CoreService.common.context.UserContext;
import com.CoreService.CoreService.role.Services.RoleService;
import com.CoreService.CoreService.role.Services.RoleServiceImpl;
import com.CoreService.CoreService.user.Entities.UserEntity;
import com.CoreService.CoreService.user.Repository.UserRepo;
import com.CoreService.CoreService.user.Requests.PasswordChangeRequest;
import com.CoreService.CoreService.user.Requests.UpdateRequest;
import com.CoreService.CoreService.user.Requests.UserRequsets;
import com.CoreService.CoreService.user.Responses.UserResponse;
import com.CoreService.CoreService.notification.NotificationProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public  class UserServiceImpl implements UserService {
    private  final UserRepo userRepo;
    private final CollegeContext collegeContext;
    private final PasswordEncoder passwordEncoder;
    private final RoleServiceImpl roleService;
    private final CollegeRepository collegeRepository;
    private final NotificationProducer notificationProducer;

    @Override
    public UserResponse createUser(UserRequsets requsets) {
        if (userRepo.existsByUserId(requsets.getUserId())) {
            throw new RuntimeException("User id already exists");
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(requsets.getUserId());
        userEntity.setPassword(passwordEncoder.encode(requsets.getPassword()));
        userEntity.setEmail(requsets.getEmail());
        userEntity.setCollegeId(collegeContext.getCollegeId());
        userEntity.setUserName(requsets.getUserName());
        userRepo.save(userEntity);

        notificationProducer.send(
                userEntity.getEmail(),
                "Campus Connect - Account Created",
                "Hello " + userEntity.getUserName() + ",\n\nYour Campus Connect account has been created successfully.\nYour User ID is: " + userEntity.getUserId() + "\n\nPlease use the credentials provided by your college administrator to sign in."
        );

        UserResponse response = new UserResponse();
        response.setUserId(userEntity.getUserId());
        response.setEmail(userEntity.getEmail());
        response.setCollegeId(userEntity.getCollegeId());
        response.setUserName(userEntity.getUserName());
        return response;
    }

    @Override
    public UserResponse getUserById(String userId) {

        UserEntity user = userRepo.findByUserIdAndCollegeId(userId,CollegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFatherName(user.getFatherName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
        response.setBloodGroup(user.getBloodGroup());
        response.setCollegeId(user.getCollegeId());
        response.setImage(user.getImage());
        response.setUserName(user.getUserName());

        return response;    }

    @Override
    public List<UserResponse> getAllUsers() {

        List<UserEntity> users = userRepo.findAll();

        return users.stream().map(user -> {

            UserResponse response = new UserResponse();

            response.setUserId(user.getUserId());
            response.setEmail(user.getEmail());
            response.setFatherName(user.getFatherName());
            response.setPhoneNumber(user.getPhoneNumber());
            response.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
            response.setBloodGroup(user.getBloodGroup());
            response.setCollegeId(user.getCollegeId());
            response.setImage(user.getImage());
            response.setUserName(user.getUserName());

            return response;

        }).toList();
    }

    @Override
    public List<UserResponse> getUsersByCollegeId() {

        UUID collegeId = collegeContext.getCollegeId();
        List<UserEntity> users = userRepo.findAllByCollegeId(collegeId);

        return users.stream().map(user -> {

            UserResponse response = new UserResponse();

            response.setUserId(user.getUserId());
            response.setEmail(user.getEmail());
            response.setFatherName(user.getFatherName());
            response.setPhoneNumber(user.getPhoneNumber());
            response.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
            response.setBloodGroup(user.getBloodGroup());
            response.setCollegeId(user.getCollegeId());
            response.setImage(user.getImage());
            response.setUserName(user.getUserName());

            return response;

        }).toList();
    }

    @Override
    public boolean deleteUser(String userId) {
        if(userId==null){
            return false;
        }
        if (!userRepo.existsByUserId(userId)) {
            throw new RuntimeException("User not found");
        }
        if(userRepo.existsByCollegeIdAndUserId(collegeContext.getCollegeId(), userId)){
            roleService.deleteAllRolesOfUser(userId);
            userRepo.deleteById(userId);
            return true;
        }
        else
            throw new RuntimeException("User with id "+userId+" does not exists");
    }

    @Override
    public boolean activateUser(String userId) {
        if(userId==null){
            return false;
        }
        UserEntity user = userRepo.findByUserIdAndCollegeId(userId,CollegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActivate(true);

        if(userRepo.existsByCollegeIdAndUserId(collegeContext.getCollegeId(), userId)){
            userRepo.save(user);
            return true;
        }
        else
            throw new RuntimeException("User with id "+userId+" does not exists");
    }

    @Override
    public boolean deActivateUser(String userId) {
        if(userId==null){
            return false;
        }
        UserEntity user = userRepo.findByUserIdAndCollegeId(userId,CollegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActivate(false);

        if(userRepo.existsByCollegeIdAndUserId(collegeContext.getCollegeId(), userId)){
            userRepo.save(user);
            return true;
        }
        else
            throw new RuntimeException("User with id "+userId+" does not exists");
    }
    public boolean deleteAllUsersOfCollege() {
        userRepo.deleteAllByCollegeId(collegeContext.getCollegeId());
        return true;
    }
    public boolean deleteAllUsersOfCollegeByCollegeId(UUID collegeId) {
        userRepo.deleteAllByCollegeId(collegeId);
        return true;
    }
    public UserResponse updateUser(UpdateRequest updateRequest) {
        String userId= UserContext.getUserId();
        if (!userRepo.existsByUserId(userId)) {
            throw new RuntimeException("User not found");
        }
        UserEntity user = userRepo.findByUserIdAndCollegeId(userId,CollegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(updateRequest.getUserName()!=null){
            user.setUserName(updateRequest.getUserName());
        }
        if(updateRequest.getImage()!=null){
            user.setImage(updateRequest.getImage());
        }
        if(updateRequest.getPhoneNumber()!=null){
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if(updateRequest.getAlternatePhoneNumber()!=null){
            user.setAlternatePhoneNumber(updateRequest.getAlternatePhoneNumber());
        }
        if(updateRequest.getBloodGroup()!=null){
            user.setBloodGroup(updateRequest.getBloodGroup());
        }
        userRepo.save(user);
        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFatherName(user.getFatherName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
        response.setBloodGroup(user.getBloodGroup());
        response.setCollegeId(user.getCollegeId());
        response.setImage(user.getImage());

        return response;

    }
    public Boolean changePassword(PasswordChangeRequest passwordChangeRequest) {
        if(passwordChangeRequest.getOldPassword().equals(passwordChangeRequest.getNewPassword())){
            throw new RuntimeException("New Password can't be same as old Password");
        }
        String userId= UserContext.getUserId();
        UserEntity user = userRepo.findByUserIdAndCollegeId(userId,collegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                passwordChangeRequest.getOldPassword(),
                user.getPassword())) {
            throw new RuntimeException("Old password is invalid.");
        }

        user.setPassword(
                passwordEncoder.encode(passwordChangeRequest.getNewPassword())
        );

        userRepo.save(user);
        return true;
    }
    public List<UserResponse> searchUsers(String keyword) {

        UUID collegeId = collegeContext.getCollegeId();

        List<UserEntity> users = userRepo
                .findByCollegeIdAndUserIdContainingIgnoreCaseOrCollegeIdAndUserNameContainingIgnoreCaseOrCollegeIdAndEmailContainingIgnoreCase(
                        collegeId, keyword,
                        collegeId, keyword,
                        collegeId, keyword
                );

        return users.stream().map(user -> {

            UserResponse response = new UserResponse();

            response.setUserId(user.getUserId());
            response.setUserName(user.getUserName());
            response.setEmail(user.getEmail());
            response.setFatherName(user.getFatherName());
            response.setPhoneNumber(user.getPhoneNumber());
            response.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
            response.setBloodGroup(user.getBloodGroup());
            response.setCollegeId(user.getCollegeId());
            response.setImage(user.getImage());

            return response;

        }).toList();
    }
    public boolean isUserExists(String userId) {
        return userRepo.existsByCollegeIdAndUserId(collegeContext.getCollegeId(), userId);
    }
    public boolean updateByAdmin(UserRequsets updateRequest) {
        if(!userRepo.existsByCollegeIdAndUserId(CollegeContext.getCollegeId(), updateRequest.getUserId())){
            throw new RuntimeException("User not found");
        }
        UserEntity user=userRepo.findByUserIdAndCollegeId(updateRequest.getUserId(),CollegeContext.getCollegeId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(updateRequest.getUserName()!=null){
            user.setUserName(updateRequest.getUserName());
        }
        if(updateRequest.getEmail()!=null){
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getPassword()!=null){
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }
        userRepo.save(user);
        return true;
    }
}
