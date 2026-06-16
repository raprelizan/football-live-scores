import express from "express";
import type { Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";

export function getSessionCookieOptions(req: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const isHttps = req.protocol === "https";
  
  return {
    secure: isProduction || isHttps,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  };
}
