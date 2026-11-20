import { z } from "zod";
import { PAYMENT_METHODS } from "@/lib/configurator-data";
import { deliverySchema } from "@/components/order/order-types";

export const fileInputSchema = z.object({
  kind: z.enum(["FOTO", "VIDEO", "AUDIO"]),
  groupId: z.string().max(40).optional(),
  url: z.string().max(600),
  publicId: z.string().max(300).optional(),
  fileName: z.string().max(200),
  bytes: z.number().int().nonnegative(),
});

export const orderInputSchema = z.object({
  product: z.string().max(60),
  size: z.string().max(30),
  presentation: z.string().max(30),
  extras: z.array(z.string().max(30)).max(6),
  braceletInitials: z.tuple([z.string().max(2), z.string().max(2)]),
  designFields: z.record(z.string().max(40), z.string().max(500)),
  comments: z.string().max(280),
  photosLater: z.boolean(),
  mediaLater: z.boolean(),
  payment: z.enum(PAYMENT_METHODS.map((m) => m.id) as [string, ...string[]]),
  delivery: deliverySchema,
  files: z.array(fileInputSchema).max(40),
});

export type OrderInput = z.infer<typeof orderInputSchema>;
export type FileInput = z.infer<typeof fileInputSchema>;

export type CreateOrderResult =
  | { ok: true; code: string; total: number; etaText: string }
  | { ok: false; error: string };
