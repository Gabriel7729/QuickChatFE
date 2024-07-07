import {
  Avatar,
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  Grid,
  Group,
  Input,
  Loader,
  Paper,
  Popover,
  ScrollArea,
  Select,
  Text,
  Timeline
} from "@mantine/core";
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconCalendar,
  IconFilter,
  IconSearch,
  IconSearchOff,
  IconStatusChange
} from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ActionStatus } from "../../../../common/enums/log.enum";
import useLogsPaginated, { useLogs } from "../../../../hooks/userlogs/useLogsPaginated.hooks";

export const DetailLogs = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleActionStatusChange = (value: string | null) => {
    setActionStatus(value);
  };

  const handleStartDateChange = (value: Date | null) => {
    setStartDate(value);
  };
  const handleEndDateChange = (value: Date | null) => {
    setEndDate(value);
  };

  const resetFilter = () => {
    setActionStatus(null);
    setStartDate(null);
    setEndDate(null);
  };

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    params.append("BranchId", id!);

    if (debouncedQuery) {
      params.append("userName", debouncedQuery);
    }

    if (actionStatus) {
      params.append("ActionStatus", actionStatus);
    }

    if (startDate) {
      // Format the date as ISO 8601 with timezone information
      const isoDate = startDate.toISOString();
      params.append("StartDate", isoDate);
    }

    if (endDate) {
      // Format the date as ISO 8601 with timezone information
      const isoDate = endDate.toISOString();
      params.append("EndDate", isoDate);
    }

    return params.toString();
  }, [id, debouncedQuery, actionStatus, startDate, endDate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const { data, isLoading, isLoadingMore, size, setSize, isReachingEnd } =
    useLogs(buildQueryString());

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isReachingEnd) {
          setSize(size + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoadingMore, isReachingEnd]
  );

  return (
    <Paper shadow="md" p="lg">
      <Grid mb="lg">
        <Grid.Col span={9}>
          <Text size="xl" fw={700} mb="lg">
            Activity Log
          </Text>
        </Grid.Col>
        <Grid.Col span={3}>
          <Group justify="flex-end">
            <Collapse in={opened}>
              <Input
                value={query}
                onChange={handleQueryChange}
                placeholder="Buscar"
                leftSection={<IconSearch size={14} />}
              />
            </Collapse>
            <Button onClick={toggle} variant="outline">
              <IconSearch size={14} />
            </Button>
            <Popover
              closeOnClickOutside={false}
              width={300}
              position="bottom"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <Button variant="outline">
                  <IconFilter size={14} />
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <Select
                  value={actionStatus}
                  onChange={handleActionStatusChange}
                  label="Estado"
                  placeholder="Seleccionar estado"
                  data={[
                    { value: "0", label: "Success" },
                    { value: "1", label: "Error" },
                    { value: "2", label: "Warning" },
                    { value: "3", label: "Info" },
                  ]}
                  comboboxProps={{ withinPortal: false }}
                  leftSection={<IconStatusChange size={18} />}
                />
                <Divider my="md" />
                <DatesProvider
                  settings={{
                    firstDayOfWeek: 0,
                    weekendDays: [0],
                    timezone: "UTC",
                  }}
                >
                  <DatePickerInput
                    value={startDate}
                    onChange={handleStartDateChange}
                    leftSection={<IconCalendar size={18} />}
                    mt="md"
                    label="Fecha de inicio"
                    placeholder="Seleccionar fecha"
                  />
                  <DatePickerInput
                    value={endDate}
                    onChange={handleEndDateChange}
                    leftSection={<IconCalendar size={18} />}
                    mt="md"
                    label="Fecha final"
                    placeholder="Seleccionar fecha"
                  />
                </DatesProvider>
                <Divider my="md" />
                <Button
                  variant="outline"
                  onClick={() => {
                    resetFilter();
                  }}
                >
                  Reset
                </Button>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Grid.Col>
      </Grid>
      {!isLoading ? (
        <ScrollArea style={{ height: 600 }}>
          <Timeline active={data.length - 1} bulletSize={24} lineWidth={2}>
            {data.length ? (
              data.map((activity, index) => (
                <Timeline.Item
                  key={activity.id}
                  ref={index === data.length - 1 ? lastElementRef : null}
                  bullet={<IconAlertCircle size={12} />}
                  title={
                    <Group>
                      <Avatar size={24} radius="xl" color="blue">
                        {activity.userName[0]}
                      </Avatar>
                      <Text fw={500}>{activity.userName}</Text>
                    </Group>
                  }
                >
                  <Text size="xs" c="gray">
                    {dayjs(activity.createdDate).format("MMM D, YYYY h:mm A")}
                  </Text>
                  <Text size="sm">{activity.message}</Text>
                  <Badge
                    color={
                      activity.actionStatus === ActionStatus.Error
                        ? "red"
                        : activity.actionStatus === ActionStatus.Success
                        ? "green"
                        : activity.actionStatus === ActionStatus.Warning
                        ? "yellow"
                        : "cyan"
                    }
                    variant="filled"
                  >
                    {activity.actionStatus === ActionStatus.Error
                      ? "Error"
                      : activity.actionStatus === ActionStatus.Success
                      ? "Success"
                      : activity.actionStatus === ActionStatus.Warning
                      ? "Warning"
                      : "Info"}
                  </Badge>
                  <Divider my="sm" />
                </Timeline.Item>
              ))
            ) : (
              <Center mt={50}>
                <div>
                  <Center>
                    <IconSearchOff size={200} />
                  </Center>
                  <Text c="dimmed" size="lg">
                    No se encontraron resultados con los filtros de busqueda solicitados
                  </Text>
                </div>
              </Center>
            )}
          </Timeline>
          {isLoadingMore && <Loader />}
        </ScrollArea>
      ) : (
        <Loader />
      )}
    </Paper>
  );
};
