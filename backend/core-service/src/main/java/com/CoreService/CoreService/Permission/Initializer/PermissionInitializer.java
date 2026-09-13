package com.CoreService.CoreService.Permission.Initializer;

import com.CoreService.CoreService.Permission.Entities.PermissionEntity;
import com.CoreService.CoreService.Permission.Repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Order(1)
public class PermissionInitializer
        implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    @Override
    public void run(String... args) {
        Map<String, String> permissions = Map.ofEntries(

                // User
                Map.entry("CREATE_USER", "Create users"),
                Map.entry("UPDATE_USER", "Update users"),
                Map.entry("DELETE_USER", "Delete users"),
                Map.entry("VIEW_USER", "View users"),
                Map.entry("VIEW_ALL_USER", "view all users"),
                Map.entry("VIEW_ALL_COLLEGE_USER", "view all users of a college"),
                Map.entry("DELETE_ALL_COLLEGE_USERS", "delete all users of a college"),
                // Role
                Map.entry("CREATE_ROLE", "Create roles"),
                Map.entry("UPDATE_ROLE", "Update roles"),
                Map.entry("DELETE_ROLE", "Delete roles"),
                Map.entry("VIEW_ROLE", "View roles"),
                Map.entry("ASSIGN_ROLE", "Assign roles to users"),
                Map.entry("REMOVE_ROLE", "Remove roles from users"),

                // Attendance
                Map.entry("MARK_ATTENDANCE", "Mark attendance"),
                Map.entry("EDIT_ATTENDANCE", "Edit attendance"),
                Map.entry("VIEW_ATTENDANCE", "View attendance"),
                Map.entry("DELETE_ATTENDANCE", "Delete attendance"),

                // Classes
                Map.entry("CREATE_CLASS", "Create classes"),
                Map.entry("UPDATE_CLASS", "Update classes"),
                Map.entry("DELETE_CLASS", "Delete classes"),
                Map.entry("VIEW_CLASS", "View classes"),
                Map.entry("TAKE_CLASS", "Conduct class"),

                // Timetable
                Map.entry("CREATE_TIMETABLE", "Create timetable"),
                Map.entry("UPDATE_TIMETABLE", "Update timetable"),
                Map.entry("DELETE_TIMETABLE", "Delete timetable"),
                Map.entry("VIEW_TIMETABLE", "View timetable"),

                // Exams
                Map.entry("CREATE_EXAM", "Create exams"),
                Map.entry("UPDATE_EXAM", "Update exams"),
                Map.entry("DELETE_EXAM", "Delete exams"),
                Map.entry("VIEW_EXAM", "View exams"),
                Map.entry("ENTER_MARKS", "Enter marks"),
                Map.entry("UPDATE_MARKS", "Update marks"),
                Map.entry("VIEW_MARKS", "View marks"),
                Map.entry("PUBLISH_RESULT", "Publish results"),

                // Assignments
                Map.entry("CREATE_ASSIGNMENT", "Create assignments"),
                Map.entry("UPDATE_ASSIGNMENT", "Update assignments"),
                Map.entry("DELETE_ASSIGNMENT", "Delete assignments"),
                Map.entry("VIEW_ASSIGNMENT", "View assignments"),
                Map.entry("SUBMIT_ASSIGNMENT", "Submit assignments"),
                Map.entry("GRADE_ASSIGNMENT", "Grade assignments"),

                // Notice
                Map.entry("CREATE_NOTICE", "Create notices"),
                Map.entry("UPDATE_NOTICE", "Update notices"),
                Map.entry("DELETE_NOTICE", "Delete notices"),
                Map.entry("VIEW_NOTICE", "View notices"),

                // Messaging
                Map.entry("SEND_MESSAGE", "Send messages"),
                Map.entry("VIEW_MESSAGE", "View messages"),
                Map.entry("DELETE_MESSAGE", "Delete messages"),

                // Events
                Map.entry("CREATE_EVENT", "Create events"),
                Map.entry("UPDATE_EVENT", "Update events"),
                Map.entry("DELETE_EVENT", "Delete events"),
                Map.entry("VIEW_EVENT", "View events"),

                // Library
                Map.entry("ADD_BOOK", "Add books"),
                Map.entry("UPDATE_BOOK", "Update books"),
                Map.entry("DELETE_BOOK", "Delete books"),
                Map.entry("VIEW_BOOK", "View books"),
                Map.entry("ISSUE_BOOK", "Issue books"),
                Map.entry("RETURN_BOOK", "Return books"),

                // Hostel
                Map.entry("ALLOCATE_ROOM", "Allocate hostel rooms"),
                Map.entry("UPDATE_ROOM", "Update hostel rooms"),
                Map.entry("VIEW_ROOM", "View hostel rooms"),
                Map.entry("VACATE_ROOM", "Vacate hostel rooms"),

                // Fees
                Map.entry("COLLECT_FEES", "Collect fees"),
                Map.entry("UPDATE_FEES", "Update fee records"),
                Map.entry("VIEW_FEES", "View fee records"),
                Map.entry("CREATE_FEE", "Create student fee account"),
                Map.entry("UPDATE_FEE", "Update student fee account"),
                Map.entry("VIEW_FEE", "View student fee account"),
                Map.entry("OPEN_FEE_FORM", "Open fee payment collection window"),
                Map.entry("UPDATE_FEE_FORM", "Update fee payment collection window"),
                Map.entry("VIEW_FEE_FORM", "View fee payment collection window"),
                Map.entry("APPROVE_FEE_FORM", "Approve student fee payment submission"),
                Map.entry("REJECT_FEE_FORM", "Reject student fee payment submission"),

                // Leave
                Map.entry("APPLY_LEAVE", "Apply leave"),
                Map.entry("APPROVE_LEAVE", "Approve leave"),
                Map.entry("REJECT_LEAVE", "Reject leave"),
                Map.entry("VIEW_LEAVE", "View leave requests"),

                // Reports
                Map.entry("VIEW_REPORT", "View reports"),
                Map.entry("EXPORT_REPORT", "Export reports"),

                // Profile
                Map.entry("VIEW_PROFILE", "View profile"),
                Map.entry("UPDATE_PROFILE", "Update profile"),

                // Settings
                Map.entry("VIEW_SETTINGS", "View settings"),
                Map.entry("UPDATE_SETTINGS", "Update settings"),

                // Permissions required by currently implemented endpoints
                Map.entry("CREATE_ATTENDANCE", "Create Attendance"),
                Map.entry("CREATE_BRANCH", "Create Branch"),
                Map.entry("CREATE_CALL", "Create Call"),
                Map.entry("CREATE_CLASS_SUBJECT", "Create Class Subject"),
                Map.entry("CREATE_CONVERSATION", "Create Conversation"),
                Map.entry("CREATE_CONVERSATION_MEMBER", "Create Conversation Member"),
                Map.entry("CREATE_COURSE", "Create Course"),
                Map.entry("CREATE_EXAM_RESULT", "Create Exam Result"),
                Map.entry("CREATE_STUDENT", "Create Student"),
                Map.entry("CREATE_STUDENT_CLASS", "Create Student Class"),
                Map.entry("CREATE_SUBJECT", "Create Subject"),
                Map.entry("CREATE_TEACHER", "Create Teacher"),
                Map.entry("CREATE_TEACHER_SUBJECT", "Create Teacher Subject"),
                Map.entry("DELETE_BRANCH", "Delete Branch"),
                Map.entry("DELETE_CLASS_SUBJECT", "Delete Class Subject"),
                Map.entry("DELETE_CONVERSATION", "Delete Conversation"),
                Map.entry("DELETE_CONVERSATION_MEMBER", "Delete Conversation Member"),
                Map.entry("DELETE_COURSE", "Delete Course"),
                Map.entry("DELETE_EXAM_RESULT", "Delete Exam Result"),
                Map.entry("DELETE_STUDENT", "Delete Student"),
                Map.entry("DELETE_STUDENT_CLASS", "Delete Student Class"),
                Map.entry("DELETE_SUBJECT", "Delete Subject"),
                Map.entry("DELETE_TEACHER", "Delete Teacher"),
                Map.entry("DELETE_TEACHER_SUBJECT", "Delete Teacher Subject"),
                Map.entry("END_CALL", "End Call"),
                Map.entry("GET_ALL_COLLEGE_COURSE", "Get All College Course"),
                Map.entry("GET_ASSIGNMENT", "Get Assignment"),
                Map.entry("GET_ATTENDANCE", "Get Attendance"),
                Map.entry("GET_BRANCH", "Get Branch"),
                Map.entry("GET_CLASS", "Get Class"),
                Map.entry("GET_CLASS_SUBJECT", "Get Class Subject"),
                Map.entry("GET_COURSE", "Get Course"),
                Map.entry("GET_EXAM", "Get Exam"),
                Map.entry("GET_EXAM_RESULT", "Get Exam Result"),
                Map.entry("GET_NOTICE", "Get Notice"),
                Map.entry("GET_STUDENT", "Get Student"),
                Map.entry("GET_STUDENT_CLASS", "Get Student Class"),
                Map.entry("GET_SUBJECT", "Get Subject"),
                Map.entry("GET_TEACHER", "Get Teacher"),
                Map.entry("GET_TEACHER_SUBJECT", "Get Teacher Subject"),
                Map.entry("MARK_ASSIGNMENT", "Mark Assignment"),
                Map.entry("UPDATE_ATTENDANCE", "Update Attendance"),
                Map.entry("UPDATE_BRANCH", "Update Branch"),
                Map.entry("UPDATE_CLASS_SUBJECT", "Update Class Subject"),
                Map.entry("UPDATE_CONVERSATION", "Update Conversation"),
                Map.entry("UPDATE_CONVERSATION_MEMBER", "Update Conversation Member"),
                Map.entry("UPDATE_COURSE", "Update Course"),
                Map.entry("UPDATE_EXAM_RESULT", "Update Exam Result"),
                Map.entry("UPDATE_STUDENT", "Update Student"),
                Map.entry("UPDATE_STUDENT_CLASS", "Update Student Class"),
                Map.entry("UPDATE_SUBJECT", "Update Subject"),
                Map.entry("UPDATE_TEACHER", "Update Teacher"),
                Map.entry("UPDATE_TEACHER_SUBJECT", "Update Teacher Subject"),
                Map.entry("VIEW_CALL", "View Call"),
                Map.entry("VIEW_CONVERSATION", "View Conversation"),
                Map.entry("VIEW_CONVERSATION_MEMBER", "View Conversation Member"),

                Map.entry("CREATE_ADMISSION", "Create admission applications"),
                Map.entry("VIEW_ADMISSION", "View admission applications"),
                Map.entry("UPDATE_ADMISSION", "Update admission applications"),
                Map.entry("DELETE_ADMISSION", "Delete admission applications"),
                Map.entry("APPROVE_ADMISSION", "Approve admission applications"),
                Map.entry("REJECT_ADMISSION", "Reject admission applications"),
                Map.entry("VIEW_ADMISSION_DOCUMENT", "View admission documents"),
                Map.entry("UPLOAD_ADMISSION_DOCUMENT", "Upload admission documents"),
                Map.entry("VERIFY_ADMISSION_DOCUMENT", "Verify admission documents"),
                Map.entry("REJECT_ADMISSION_DOCUMENT", "Reject admission documents"),

                //permissions
                Map.entry("GET_PERMISSION","can get permissions data"),
                Map.entry("ASSIGN_PERMISSION","permission can be assigned to role"),
                Map.entry("REMOVE_PERMISSION","permission can be deassigned for role")
        );


        for (Map.Entry<String, String> entry : permissions.entrySet()) {

            String permissionCode = entry.getKey();
            String description = entry.getValue();

            if (!permissionRepository.existsByPermissionCode(permissionCode)) {

                PermissionEntity permission = PermissionEntity.builder()
                        .permissionCode(permissionCode)
                        .permissionName(permissionCode.replace("_", " "))
                        .permissionDescription(description)
                        .build();

                permissionRepository.save(permission);
            }
        }
    }
}
