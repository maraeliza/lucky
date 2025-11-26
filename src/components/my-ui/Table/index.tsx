"use client";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
  Flex,
  Select,
  Text,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { PaginationControls } from "../Pagination";
import { GenericTableProps } from "@/interfaces/common";

export function TableWithPagination<T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  pagination,
  onView,
}: GenericTableProps<T>) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const theadBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  return (
    <Box
      bg={bg}
      p={4}
      rounded="md"
      shadow="md"
      borderWidth="1px"
      borderColor={border}
      overflowX="auto"
    >
      <Table variant="simple" size="md">
        <Thead bg={theadBg}>
          <Tr>
            {columns.map((col) => (
              <Th key={String(col.key)} fontWeight="bold">
                {col.header}
              </Th>
            ))}
            <Th textAlign="center">Ações</Th>
          </Tr>
        </Thead>

        <Tbody>
          {data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length + 1} textAlign="center">
                Nenhum dado encontrado
              </Td>
            </Tr>
          ) : (
            data.map((item, index) => (
              <Tr key={index} _hover={{ bg: hoverBg }}>
                {columns.map((col) => (
                  <Td key={String(col.key)}>
                    {col.render
                      ? col.render(item[col.key], item)
                      : String(item[col.key])}
                  </Td>
                ))}

                <Td>
                  <Flex justify="center" gap={2}>
                    {onView && (
                      <IconButton
                        aria-label="Visualizar"
                        icon={<ViewIcon />}
                        size="sm"
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => onView(item)}
                      />
                    )}
                    {onEdit && (
                      <IconButton
                        aria-label="Editar"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(item)}
                      />
                    )}

                    {onDelete && (
                      <IconButton
                        aria-label="Excluir"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(item)}
                      />
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {pagination && (
        <Flex mt={4} justify="space-between" align="center">
          <Flex gap={2} align="center">
            <Text>Itens por página:</Text>
            <Select
              size="sm"
              width="80px"
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange(Number(e.target.value))
              }
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </Flex>

          <PaginationControls
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={pagination.onPageChange}
          />
        </Flex>
      )}
    </Box>
  );
}
