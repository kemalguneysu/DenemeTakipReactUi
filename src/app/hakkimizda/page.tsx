import FAQSection from "@/components/faq";
import { LoginForm } from "@/components/login";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { faqQuestions } from "@/config/faq-questions";
import { FaqItem } from "@/types";
import Link from "next/link";
import React from "react";

const Hakkimizda = () => {
  return (
    <div className="max-w-7xl mx-auto mt-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Deneme Takip</h2>
          <h3 className="text-xl font-semibold mt-2 ">Hakkında</h3>
        </CardHeader>
        <CardContent>
          <p className="opacity-100 ">
            Bu site Kemal GÜNEYSU tarafından yapılmıştır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hakkimizda;
