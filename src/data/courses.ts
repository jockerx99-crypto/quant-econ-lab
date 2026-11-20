import { CourseModule } from "@/types/course";
import { SQL_ACTUARIAT_MODULE } from "@/data/courses_v1_sql";
import { PYTHON_ECONOMETRIE_MODULE } from "@/data/courses_v1_py";
import { SQL_SUITE_MODULE } from "@/data/courses_v1_suite_sql";
import { PYTHON_SUITE_MODULE } from "@/data/courses_v1_suite_py";
import { PYTHON_FINANCE_PROG_MODULE } from "@/data/courses_v1_prog_py";

export const COURSE_MODULES: CourseModule[] = [
  SQL_ACTUARIAT_MODULE,
  SQL_SUITE_MODULE,
  PYTHON_FINANCE_PROG_MODULE,
  PYTHON_ECONOMETRIE_MODULE,
  PYTHON_SUITE_MODULE,
];
