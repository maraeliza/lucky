import { Flex, Text, Select, IconButton, HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  lastPage,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <Flex
      mt={6}
      justify="space-between"
      align="center"
      p={2}
      bg="white"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      boxShadow={'sm'}
    >
      <Flex gap={2} align="center">
        <Text fontSize="sm">Itens por página:</Text>
        <Select
          size="sm"
          width="80px"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Controles de paginação */}
      <HStack spacing={2}>
        <IconButton
          aria-label="Página anterior"
          icon={<ChevronLeftIcon />}
          size="sm"
          isDisabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        />

        <Text fontSize="sm">
          Página <strong>{currentPage}</strong> de <strong>{lastPage}</strong>
        </Text>

        <IconButton
          aria-label="Próxima página"
          icon={<ChevronRightIcon />}
          size="sm"
          isDisabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </HStack>
    </Flex>
  );
}
