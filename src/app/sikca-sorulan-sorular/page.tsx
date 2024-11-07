import FAQSection from "@/components/faq";
import { LoginForm } from "@/components/login";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { faqQuestions } from "@/config/faq-questions";
import { FaqItem } from "@/types";
import Link from "next/link";
import React from "react";

const SikcaSorulanSorular = () => {
  return (
    <div className="max-w-xl mx-auto mt-4">
      <Card>
        <CardHeader>
          <h2 className="text-3xl font-semibold text-center ">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-sm text-gray-500 text-center pt-2">
            Deneme Takip hakkında merak ettiklerinizi burada bulabilirsiniz.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqQuestions.faq.map((item: FaqItem) => (
              <AccordionItem className="py-2" key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm opacity-80">
            Başka bir konuda yardım almak için bizimle{" "}
            <Link href="/iletisim" className="text-blue-500">
              iletişime{" "}
            </Link>
            geçebilirsiniz.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SikcaSorulanSorular;
