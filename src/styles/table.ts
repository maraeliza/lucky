import { tableAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const variantRounded = definePartsStyle(() => {
  return {
    table: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e3e3e3",
      boxShadow: "sm",
      borderRadius: "12px", // Arredondamento geral da tabela
    },
    thead: {
      th: {
        borderBottomWidth: "1px",
        _first: {
          borderTopLeftRadius: "12px", // Arredonda o canto superior esquerdo
        },
        _last: {
          borderTopRightRadius: "12px", // Arredonda o canto superior direito
        },
      },
    },
    tbody: {
      tr: {
        borderBottomWidth: "1px",
        borderColor: "#e3e3e3",
        _last: {
          td: {
            _first: {
              borderBottomLeftRadius: "12px", // Arredonda o canto inferior esquerdo
            },
            _last: {
              borderBottomRightRadius: "12px", // Arredonda o canto inferior direito
            },
          },
        },
      },
    },
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: { borderBottomWidth: 0 },
        },
      },
    },
  };
});

export const tableTheme = defineMultiStyleConfig({
  variants: {
    megaue: variantRounded,
  },
});
