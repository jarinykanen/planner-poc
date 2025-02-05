import {
  ColorPicker,
  type ComboboxItem,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Skeleton,
  Switch,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker, TimeInput } from "@mantine/dates";
import { CalendarClock } from "lucide-react";
import DateAndTimeUtils from "../../utils/date-and-time-utils";

interface Props {
  title?: string;
  value?: string | number;
  dateProps?: {
    minDate?: Date;
    maxDate?: Date;
    dateValue?: Date;
    defaultValue?: Date;
  };
  selectProps?: {
    selectOptions?: ComboboxItem[];
    selectValue?: string | null | undefined;
  };
  multiSelectProps?: {
    multiSelectOptions?: ComboboxItem[];
    multiSelectValues?: string[] | undefined;
    onMultiSelectChange?: (value: string[]) => void;
  };
  switchProps?: {
    switchValue?: boolean;
  };
  colorPickerProps?: {
    colorValue?: string;
    onColorChange?: (value: string) => void;
  };
  column?: boolean;
  /**
   * Size of the text
   */
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  placeholder?: string;
  unit?: string;
  edit?: boolean;
  inputType?: "text" | "number" | "date" | "select" | "multiSelect" | "switch" | "textarea" | "time" | "color";
  disabled?: boolean;
  tooltip?: string;
  onChange?: (value: string | number | Date | boolean) => void;
}

const DataGroup = ({
  title,
  value,
  size = "md",
  column = false,
  loading,
  placeholder = "-",
  unit,
  edit,
  inputType,
  dateProps,
  selectProps,
  multiSelectProps,
  switchProps,
  colorPickerProps,
  disabled,
  tooltip,
  onChange,
}: Props) => {
  const { selectOptions, selectValue } = selectProps || {};
  const { switchValue } = switchProps || {};
  const { multiSelectValues, multiSelectOptions, onMultiSelectChange } = multiSelectProps || {};
  const { colorValue, onColorChange } = colorPickerProps || {};

  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <TextInput
            placeholder={placeholder}
            value={value}
            style={{ width: "100%" }}
            onChange={(event) => onChange?.(event.currentTarget.value)}
            disabled={disabled}
          />
        );
      case "number":
        return (
          <NumberInput
            placeholder={placeholder}
            value={value}
            suffix={unit ? ` ${unit}` : undefined}
            style={{ width: "100%" }}
            onChange={(value) => onChange?.(value)}
            disabled={disabled}
          />
        );
      case "date":
        return (
          <DateTimePicker
            placeholder={placeholder}
            value={dateProps?.dateValue}
            defaultValue={dateProps?.defaultValue}
            rightSection={<CalendarClock size={18} />}
            style={{ height: 36, overflow: "hidden", width: "100%" }}
            onChange={(value) => onChange?.(value as Date)}
            minDate={dateProps?.minDate}
            maxDate={dateProps?.maxDate}
            disabled={disabled}
          />
        );
      case "time":
        return <TimeInput placeholder={placeholder} style={{ width: "100%" }} />;
      case "select":
        return (
          <Select
            data={selectOptions}
            value={typeof selectValue === "string" ? selectValue : null}
            placeholder={placeholder}
            style={{ width: "100%" }}
            onChange={(newValue) => newValue && onChange?.(newValue)}
            disabled={disabled}
            searchable
          />
        );
      case "multiSelect":
        return (
          <MultiSelect
            data={multiSelectOptions}
            value={multiSelectValues}
            placeholder={placeholder}
            style={{ width: "100%" }}
            onChange={(newValue) => newValue && onMultiSelectChange?.(newValue)}
            disabled={disabled}
            searchable
            multiple
          />
        );
      case "textarea":
        return (
          <Textarea
            value={value}
            placeholder={placeholder}
            style={{ width: "100%" }}
            onChange={(value) => onChange?.(value.currentTarget.value)}
          />
        );
      case "switch":
        return (
          <Switch
            label={switchValue ? "Yes" : "No"}
            checked={switchValue ?? false}
            style={{ width: "100%", height: "36px", padding: 0 }}
            disabled={disabled}
            onChange={(value) => onChange?.(value.currentTarget.checked)}
          />
        );
      case "color":
        return (
          <ColorPicker
            format="hex"
            swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
            value={colorValue}
            onChange={(value) => onColorChange?.(value)}
          />
        );
      default:
        return (
          <TextInput
            placeholder={placeholder}
            value={value}
            rightSection={<Text c="gray.6">{unit}</Text>}
            style={{ width: "100%" }}
            disabled={disabled}
          />
        );
    }
  };

  const renderValue = () => {
    if (switchValue !== undefined) {
      return (
        <Text size={size} fw={700} style={{ whiteSpace: "nowrap", lineHeight: "36px" }}>
          {switchValue ? "Yes" : "No"}
        </Text>
      );
    }

    if (dateProps?.dateValue) {
      return (
        <Text size={size} fw={700} style={{ whiteSpace: "nowrap", lineHeight: "36px" }}>
          {DateAndTimeUtils.formatToDisplayDateTime(dateProps?.dateValue)}
        </Text>
      );
    }

    if (selectValue) {
      return (
        <Text size={size} fw={700} style={{ whiteSpace: "nowrap", lineHeight: "36px" }}>
          {selectValue}
        </Text>
      );
    }

    if (value === undefined || value === "") {
      return (
        <Text size={size} fw={700} c="gray.5" style={{ lineHeight: "36px" }}>
          {placeholder}
        </Text>
      );
    }

    return (
      <Text size={size} fw={700} style={{ lineHeight: "36px" }}>
        {value} {unit}
      </Text>
    );
  };

  const renderDataGroupContent = () => {
    if (loading) {
      return <Skeleton title="Loading data..." flex={column ? undefined : 1} h={32} />;
    }

    return (
      <Tooltip label={tooltip} position="top" hidden={!tooltip}>
        {edit ? renderInput() : renderValue()}
      </Tooltip>
    );
  };

  return (
    <Group
      flex={1}
      px={16}
      py={8}
      style={{
        flexDirection: column ? "column" : "row",
        justifyContent: column ? "flex-start" : "space-between",
        alignContent: column ? "flex-start" : "center",
        alignItems: column ? "flex-start" : "center",
        backgroundColor: edit ? "#EBF1FF" : "white",
        overflow: "hidden",
      }}
      gap={column ? 0 : 8}
      title={title}
    >
      {title && (
        <Text
          size={size}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "-webkit-fill-available",
            whiteSpace: "nowrap",
            lineHeight: "24px",
          }}
        >
          {title}
        </Text>
      )}
      {renderDataGroupContent()}
    </Group>
  );
};

export default DataGroup;
