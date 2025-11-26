// components/ClosableAlert.tsx
"use client";

import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Link, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";

interface ClosableAlertProps {
  status: "error" | "success" | "warning" | "info";
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

export default function ClosableAlert({
  status,
  title,
  description,
  linkText,
  linkHref,
}: ClosableAlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Alert status={status} borderRadius="lg" position="relative" pr={10}>
      <AlertIcon />
      <HStack spacing={2} align="start">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        {linkText && linkHref && (
          <Link as={NextLink} href={linkHref} color="blue.500" ml={2}>
            {linkText}
          </Link>
        )}
      </HStack>

      <CloseButton
        position="absolute"
        right={2}
        top={2}
        onClick={() => setVisible(false)}
      />
    </Alert>
  );
}
