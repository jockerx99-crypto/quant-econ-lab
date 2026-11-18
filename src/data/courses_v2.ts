import { CourseModule } from "@/types/course";
import { V2_SQL_QUANT_MODULE } from "@/data/courses_v2_sql";
import { V2_FINANCE_ECONOMETRICS_MODULE } from "@/data/courses_v2_econometrics";
import { V2_MONTE_CARLO_MODULE } from "@/data/courses_v2_montecarlo";

export const COURSE_MODULES_V2: CourseModule[] = [
  V2_SQL_QUANT_MODULE,
  V2_FINANCE_ECONOMETRICS_MODULE,
  V2_MONTE_CARLO_MODULE,
];
