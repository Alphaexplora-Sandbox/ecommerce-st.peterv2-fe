export function bindInput(setter: (val: string) => void) {
  return (e: { target: { value: string } }) => setter(e.target.value);
}

export function bindCheckbox(setter: (val: boolean) => void) {
  return (e: { target: { checked: boolean } }) => setter(e.target.checked);
}

export function bindSelect<T extends string>(setter: (val: T) => void) {
  return (e: { target: { value: string } }) => setter(e.target.value as T);
}

export function bindItemUpdate<T>(
  updateFn: (id: string, field: keyof T, val: string | number) => void,
  id: string,
  field: keyof T
) {
  return (e: { target: { value: string | number } }) => updateFn(id, field, e.target.value);
}