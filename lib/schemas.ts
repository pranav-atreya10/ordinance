import { z } from "zod";
import { PROJECT_TYPES } from "./precheck-types";
import { ZONES } from "./site";

const short = z.string().trim().max(60).default("");
export const ProjectSchema = z.object({
  type: z.enum(PROJECT_TYPES as [string, ...string[]]),
  zone: z.string().refine((v) => v === "" || ZONES.includes(v)).default(""),
  size: short,
  height: short,
  front: short,
  side: short,
  rear: short,
  details: z.string().trim().max(1000).default(""),
});
