import type { NextRequest } from "next/server";
import type { Schema } from "zod";

export async function validateMiddleware(req: NextRequest, schema?: Schema) {
  if (!schema) return;

  const body = await req.json();

  const { error, data } = schema.safeParse(body);

  if (error?.errors) {
    throw `Validation error: ${error?.errors?.map((x) => `${x.path?.[0]}:${x.message}`).join(", ")}`;
  }

  req.json = () => data as never;
}
