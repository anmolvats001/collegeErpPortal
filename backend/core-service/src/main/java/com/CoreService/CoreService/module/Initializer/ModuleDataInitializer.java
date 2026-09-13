package com.CoreService.CoreService.module.Initializer;

import com.CoreService.CoreService.module.Entities.ModuleEntity;
import com.CoreService.CoreService.module.Repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ModuleDataInitializer
        implements CommandLineRunner {

    private final ModuleRepository
            moduleRepository;

    @Override
    public void run(String... args) {
        Map<String, String> modules = Map.ofEntries(
                Map.entry("ATTENDANCE", "Manages student attendance records and tracking"),
                Map.entry("LIBRARY", "Controls library books, issuing, returns, and fines"),
                Map.entry("HOSTEL", "Manages hostel rooms, allotments, and resident details"),
                Map.entry("EXAM", "Handles examinations, results, marks, and grading"),
                Map.entry("ADMISSION", "Manages student admissions and enrollment process"),
                Map.entry("TIMETABLE", "Handles timetable scheduling and class management"),
                Map.entry("FACULTY", "Manages faculty details, departments, and assignments"),
                Map.entry("NOTICE", "Manages notices, announcements, and notifications"),
                Map.entry("EVENT", "Handles events, seminars, and college activities"),
                Map.entry("FEE", "Handles fee management, fee structures, forms and payments")
        );
        for (Map.Entry<String, String> entry
                : modules.entrySet()) {

            String moduleCode =
                    entry.getKey();

            String description =
                    entry.getValue();

            boolean exists =
                    moduleRepository
                            .existsByModuleCode(
                                    moduleCode
                            );

            if (!exists) {

                ModuleEntity module =

                        ModuleEntity
                                .builder()

                                .moduleCode(
                                        moduleCode
                                )

                                .moduleName(
                                        moduleCode +
                                                " Module"
                                )

                                .moduleDescription(
                                        description
                                )

                                .build();

                moduleRepository.save(
                        module
                );
            }
        }
    }
}