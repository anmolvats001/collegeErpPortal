package com.CoreService.CoreService.user.Controller;

import com.CoreService.CoreService.common.Response.BasicResponse;
import com.CoreService.CoreService.common.context.UserContext;
import com.CoreService.CoreService.user.Requests.PasswordChangeRequest;
import com.CoreService.CoreService.user.Requests.UpdateRequest;
import com.CoreService.CoreService.user.Requests.UserRequsets;
import com.CoreService.CoreService.user.Responses.UserResponse;
import com.CoreService.CoreService.user.Services.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/core/users")
public class UserController {

    private final UserServiceImpl userService;

    private final UserContext userContext;

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_USER')")
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody UserRequsets request) {
        System.out.println("Inside createUser controller");

        UserResponse response = userService.createUser(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('VIEW_USER')")
    public ResponseEntity<UserResponse> getMyProfile() {

        String userId = userContext.getUserId();

        UserResponse response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('VIEW_USER')")

    public ResponseEntity<UserResponse> getUserById(
            @PathVariable String userId) {

        UserResponse response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PatchMapping("/byUser")
    public ResponseEntity<UserResponse> updateUser(@RequestBody UpdateRequest updateRequest) {
        UserResponse response = userService.updateUser(updateRequest);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/byAdmin")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<BasicResponse> updateUserByAdmin(@RequestBody UserRequsets updateRequest) {
        boolean result= userService.updateByAdmin(updateRequest);
        if (result) {
            return ResponseEntity.ok(BasicResponse.builder().success(true).message("User updated successfully").build());
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(BasicResponse.builder().success(false).message("User Data Not Updated").build());
    }
    @GetMapping("/all")
    @PreAuthorize("hasRole('MAIN_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    @GetMapping("/college")
    @PreAuthorize("hasAuthority('VIEW_ALL_COLLEGE_USER')")
    public ResponseEntity<List<UserResponse>> getUsersByCollegeId() {

        List<UserResponse> users = userService.getUsersByCollegeId();

        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('DELETE_USER')")
    public ResponseEntity<BasicResponse> deleteUser(
            @PathVariable String userId) {

      if(  userService.deleteUser(userId)) return ResponseEntity.ok(BasicResponse.builder().message("User deleted successfully").success(true).build());
      else return ResponseEntity.ok(BasicResponse.builder().message("User can't be deleted").success(false).build());
    }

    @PatchMapping("/{userId}/activate")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<BasicResponse> activateUser(
            @PathVariable String userId) {

        if(userService.activateUser(userId)) return ResponseEntity.ok(BasicResponse.builder().message("User activated successfully").success(true).build());
        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(BasicResponse.builder().message("User can't be activated").success(false).build());

    }

    @PatchMapping("/{userId}/deactivate")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<BasicResponse> deactivateUser(
            @PathVariable String userId) {

        if(userService.deActivateUser(userId)) return ResponseEntity.ok(BasicResponse.builder().message("User deactivated successfully").success(true).build());
        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(BasicResponse.builder().message("User can't be deactivated").success(false).build());
    }
    @PreAuthorize("hasAuthority('DELETE_ALL_COLLEGE_USERS')")
    @DeleteMapping("/all")
    public ResponseEntity<BasicResponse> deleteAllCollegeUsers() {
        if(userService.deleteAllUsersOfCollege())return ResponseEntity.ok(BasicResponse.builder().message(" All Users deleted successfully").success(true).build());
      else return ResponseEntity.ok(BasicResponse.builder().message("Users can't be deleted").success(false).build());
    }
    @PatchMapping("/changePassword")
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    public ResponseEntity<BasicResponse> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        boolean result=userService.changePassword(passwordChangeRequest);
        if(result) {
            return ResponseEntity.ok(BasicResponse.builder().message("Password changed successfully").success(true).build());
        }
        return  ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(BasicResponse.builder().message("Password can't be changed").success(false).build());
    }
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('VIEW_USER')")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam String keyword) {

        return ResponseEntity.ok(userService.searchUsers(keyword));
    }
    @PreAuthorize("hasAuthority('VIEW_USER')")
    @GetMapping("/checkUser")
    public ResponseEntity<BasicResponse> checkUser(@RequestParam String userId) {
        boolean result=userService.isUserExists(userId);
        if(result) {
            return ResponseEntity.ok(BasicResponse.builder().message("User check successfully").success(true).build());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BasicResponse.builder().message("User not found").success(false).build());
    }

}