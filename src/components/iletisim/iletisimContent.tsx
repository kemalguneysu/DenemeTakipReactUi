"use client";
import { Mail } from "lucide-react";
import React from "react";
import { Card, CardHeader, CardFooter, CardContent } from "../ui/card";

export default function IletisimContent() {
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="max-w-sm mx-auto mt-4">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">İletişim</h2>
        </CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Mail size={20} />
          <span>
            E-mail:{" "}
            <a href="mailto:denemetakip@gmail.com" className="text-blue-500">
              denemetakip@gmail.com
            </a>
          </span>
        </CardContent>
        <CardFooter className="text-center text-sm opacity-80">
          Merak ettiğiniz diğer konular için bizimle iletişime geçebilirsiniz.
        </CardFooter>
      </Card>
    </div>
  );
}