import { NextResponse } from "next/server";
import { setJson } from "./set-json";

export function errorHandler(err: any) {
  if (typeof err === "string") {
    const is404 = err.toLowerCase().endsWith("not found");
    const status = is404 ? 404 : 400;
    return NextResponse.json(
      setJson({
        message: err,
        code: status,
      }),
      {
        status,
      },
    );
  }

  if ((err as { name: string }).name === "JsonWebTokenError") {
    return NextResponse.json(
      setJson({
        message: "Unauthorized",
        code: 401,
      }),
      { status: 401 },
    );
  }

  if ((err as { name: string }).name === "UserExistsError") {
    return NextResponse.json(
      setJson({
        message: (err as { message: string }).message,
        code: 422,
      }),
      {
        status: 422,
      },
    );
  }

  console.error(err);
  return NextResponse.json(
    setJson({
      message: (err as { message: string }).message,
      code: 500,
    }),
    {
      status: 500,
    },
  );
}
