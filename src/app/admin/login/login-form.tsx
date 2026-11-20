"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-5 flex flex-col gap-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-900">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-lavender-200 px-4 py-3 text-sm outline-none focus:border-lavender-500"
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-blush-400">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-lavender-600 px-6 py-3 text-sm font-semibold text-white hover:bg-lavender-700 disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
