import { Select, SelectItem } from '@heroui/react'
import { Controller } from 'react-hook-form'

interface Props {
  control: any
  name: string
  label: string
  options: { key: string; value: string }[]
  isRequired?: boolean
  selectMode?: 'single' | 'multiple'
  defaultSelectedKeys?: string[]
  onChange?: (value: string) => void
}

const SelectField = ({
  control,
  name,
  label,
  options,
  isRequired,
  selectMode = 'single',
  defaultSelectedKeys = [],
  onChange = () => {
    /* default no-op */
  },
}: Props) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const defaultKeys =
          defaultSelectedKeys.length > 0 ? defaultSelectedKeys : (field.value ? [field.value] : [])
        return (
        <Select
          {...field}
          isRequired={isRequired}
          errorMessage={fieldState.error?.message}
          isInvalid={!!fieldState.error}
          selectionMode={selectMode}
          name={name}
          label={label}
          labelPlacement="outside"
          placeholder={label}
          defaultSelectedKeys={defaultKeys}
          onChange={(event) => {
            const value = event.target.value
            field.onChange(event)
            onChange(value)
          }}
        >
          {options.map((option) => (
            <SelectItem key={option.key}>{option.value}</SelectItem>
          ))}
        </Select>
      )
      }}
    />
  )
}

export default SelectField
