"use client";

import { HStack, IconButton, Button } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Props {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  lastPage,
  onPageChange,
}: Props) {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < lastPage) onPageChange(currentPage + 1);
  };

  return (
    <HStack spacing={1}>
      <IconButton
        size="sm"
        aria-label="Página anterior"
        icon={<ChevronLeftIcon />}
        onClick={handlePrev}
        isDisabled={currentPage === 1}
      />

      <Button size="sm" variant="solid" colorScheme="blue">
        {currentPage}
      </Button>

      <IconButton
        size="sm"
        aria-label="Próxima página"
        icon={<ChevronRightIcon />}
        onClick={handleNext}
        isDisabled={currentPage === lastPage}
      />
    </HStack>
  );
}
