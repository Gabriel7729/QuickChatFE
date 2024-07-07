import React from "react";
import { Group, Button, Select, Text } from "@mantine/core";
import { PagesToSelect } from "../../../common/constants/paginationSelect.constant";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number, pageToShow: number) => void;
};

const PaginationTable: React.FC<PaginationProps> = ({
  currentPage = 1,
  pageSize = 10,
  totalPages = 1,
  totalItems = 0,
  onChange,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  const createPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Group justify="space-between" mt="md">
      <div>
        <Text
          size="sm"
          mr="md"
          component="span"
          style={{ verticalAlign: "middle" }}
        >
          Elementos por página:
        </Text>
        <Select
          size="xs"
          value={pageSize.toString()}
          style={{ display: "inline-block", width: "auto" }}
          onChange={(value) => onChange(1, Number(value))}
          data={PagesToSelect.map((page: number) => ({
            value: page.toString(),
            label: page.toString(),
          }))}
        />
      </div>

      <Text size="sm">
        {startItem}-{endItem} de {totalItems} elementos
      </Text>

      <Group>
        <Button
          variant="filled"
          size="xs"
          onClick={() => onChange(Math.max(1, currentPage - 1), pageSize)}
          disabled={currentPage === 1}
        >
          <IconChevronLeft width={"20px"} height={"20px"} />
        </Button>
        {createPageNumbers().map((page, index) => (
          <Button
            size="xs"
            variant={currentPage === page ? "filled" : "outline"}
            key={"PagBtn" + index}
            onClick={() => typeof page === "number" && onChange(page, pageSize)}
            disabled={page === "..."}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="filled"
          size="xs"
          onClick={() =>
            onChange(Math.min(totalPages, currentPage + 1), pageSize)
          }
          disabled={currentPage === totalPages}
        >
          <IconChevronRight width={"20px"} height={"20px"} />
        </Button>
      </Group>
    </Group>
  );
};

export default PaginationTable;
