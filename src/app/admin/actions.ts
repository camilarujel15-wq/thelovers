"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ALL_STATUSES } from "@/lib/orders";
import {
  adminConfigured,
  createAdminSession,
  destroyAdminSession,
  passwordMatches,
  requireAdmin,
} from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { sendStatusEmail } from "@/lib/server/order-emails";
import { rateLimit } from "@/lib/server/rate-limit";
import type { OrderStatus } from "@/types";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "El panel no está configurado: define ADMIN_PASSWORD y ADMIN_SESSION_SECRET." };
  }
  if (!(await rateLimit("admin-login", 6, 15 * 60 * 1000))) {
    return { error: "Demasiados intentos. Espera unos minutos." };
  }
  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    return { error: "Contraseña incorrecta." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

const statusSchema = z.object({
  code: z.string().min(3).max(20),
  status: z.enum(ALL_STATUSES as [OrderStatus, ...OrderStatus[]]),
  note: z.string().max(300).optional(),
});

export async function updateStatusAction(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.safeParse({
    code: formData.get("code"),
    status: formData.get("status"),
    note: String(formData.get("note") ?? "").trim() || undefined,
  });
  if (!parsed.success) return;
  const { code, status, note } = parsed.data;

  const db = getDb();
  const order = await db.order.findUnique({ where: { code } });
  if (!order) return;

  if (order.status !== status) {
    await db.order.update({
      where: { code },
      data: { status, events: { create: { status, note: note ?? null } } },
    });
    if (formData.get("notify") === "on") {
      await sendStatusEmail(
        { code: order.code, customerName: order.customerName, customerEmail: order.customerEmail },
        status,
        note,
      );
    }
  }

  revalidatePath("/admin");
  redirect(`/admin/pedidos/${code}?ok=estado`);
}

export async function updatePaymentAction(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  const paid = formData.get("paid") === "true";
  if (!code) return;

  await getDb().order.update({
    where: { code },
    data: { paymentStatus: paid ? "PAGADO" : "PENDIENTE", paidAt: paid ? new Date() : null },
  });

  revalidatePath("/admin");
  redirect(`/admin/pedidos/${code}?ok=pago`);
}

export async function saveNoteAction(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 1000);
  if (!code) return;

  await getDb().order.update({ where: { code }, data: { internalNote: note || null } });
  redirect(`/admin/pedidos/${code}?ok=nota`);
}
