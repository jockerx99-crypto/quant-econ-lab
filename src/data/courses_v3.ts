import { CourseModule } from "@/types/course";
import { V3_SQL_CASES_MODULE } from "@/data/courses_v3_sql";
import { V3_PYTHON_CASES_MODULE } from "@/data/courses_v3_py";

export const COURSE_MODULES_V3: CourseModule[] = [
  V3_SQL_CASES_MODULE,
  V3_PYTHON_CASES_MODULE,
];
