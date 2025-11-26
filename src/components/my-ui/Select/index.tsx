import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  VStack,
  Text,
  HStack,
  IconButton,
  List,
  ListItem,
  Tooltip,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { Item } from "@/utils/interfaces";

interface SearchableSelectProps {
  options: Item[];
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder: string;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  clear: boolean;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  onChange,
  placeholder,
  clear,
  setClear,
  value,
  disabled,
}) => {
  const [searchTerm, setSearchTerm] = useState(value ? "" : placeholder);
  const [filteredOptions, setFilteredOptions] = useState<Item[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options.slice(0, 5));
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    }
  }, [options, searchTerm]);

  useEffect(() => {
    if (clear) {
      setSearchTerm("");
      setIsDropdownOpen(false);
      setClear(false);
      onChange(0);
    }
  }, [clear, onChange, setClear]);

  useEffect(() => {
    if (value !== 0) {
      const option = options.find((opt) => opt.id === value);
      setSearchTerm(option?.name || "");
    }
  }, [options, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(e.target.value.length > 0);
  };

  const handleOptionSelect = (option: Item) => {
    onChange(option.id);
    setSearchTerm(option.name);
    setIsDropdownOpen(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    onChange(0);
  };
  return (
    <Tooltip label={disabled ? "Não é possível alterar" : ""}>
      <Box sx={{ opacity: disabled ? 0.5 : 1 }}>
        <VStack spacing={2} align="stretch">
          <HStack spacing={2} alignItems={"center"} justifyContent={"center"}>
            <Input
              mb={2}
              size="lg"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={placeholder}
              _focus={{ borderColor: "blue.500" }}
              borderRadius="md"
              paddingRight="40px"
              disabled={disabled}
            />
            {searchTerm && (
              <IconButton
                mb={2}
                size="sm"
                icon={<FiX />}
                right="10px"
                variant="ghost"
                colorScheme="red"
                position="absolute"
                alignSelf={"center"}
                onClick={handleClearSearch}
                aria-label="Limpar pesquisa"
              />
            )}
          </HStack>

          {isDropdownOpen && filteredOptions.length > 0 && (
            <Box
              borderWidth={1}
              borderRadius="md"
              borderColor="gray.300"
              maxHeight="200px"
              overflowY="auto"
              width="100%"
              boxShadow="md"
              bgColor="white"
              zIndex={1}
              p={2}
            >
              <List spacing={1}>
                {filteredOptions.map((option) => (
                  <ListItem
                    key={option.id}
                    padding={2}
                    cursor="pointer"
                    _hover={{ bgColor: "gray.100" }}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <Text>{option.name}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {isDropdownOpen && filteredOptions.length === 0 && (
            <Box
              borderWidth={1}
              borderRadius="md"
              borderColor="gray.300"
              maxHeight="200px"
              width="100%"
              boxShadow="md"
              bgColor="white"
              zIndex={1}
            >
              <Text padding={2} color="gray.500" fontSize="sm">
                Nenhuma opção encontrada
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Tooltip>
  );
};

export default SearchableSelect;
