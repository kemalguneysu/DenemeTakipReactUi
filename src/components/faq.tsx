import React from "react";

import { FaqItem } from "@/types";
import { faqQuestions } from "@/config/faq-questions";
import { Accordion, AccordionContent, AccordionItem } from "@radix-ui/react-accordion";
import { AccordionTrigger } from "./ui/accordion";
type Props = {};

export default function FAQSection({}: Props) {
  return (
    <div>
      <h1 className="  text-3xl font-semibold text-center pb-4">
        Sıkça Sorulan Sorular
      </h1>
      <p className="text-center text-muted-foreground text-base pb-4">
        Deneme Takip Hakkında Daha Fazla Bilgi Edinin.
      </p>
      <Accordion type="single" collapsible>
        {faqQuestions.faq.map((item: FaqItem) => (
          <AccordionItem className="py-2" key={item.id} value={item.id}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}