import { bindInput, bindCheckbox, bindSelect, bindItemUpdate } from '../../src/components/handlers';

describe('handlers.ts', () => {
  it('covers bindInput', () => {
    let result = '';
    const handler = bindInput((v) => { result = v; });
    handler({ target: { value: 'test' } });
    expect(result).toBe('test');
  });

  it('covers bindCheckbox', () => {
    let result = false;
    const handler = bindCheckbox((v) => { result = v; });
    handler({ target: { checked: true } });
    expect(result).toBe(true);
  });

  it('covers bindSelect', () => {
    let result = '';
    const handler = bindSelect((v) => { result = v; });
    handler({ target: { value: 'selected-opt' } });
    expect(result).toBe('selected-opt');
  });

  it('covers bindItemUpdate', () => {
    let resId = '';
    let resField = '';
    let resVal: string | number = '';
    const handler = bindItemUpdate(
      (id, field, val) => {
        resId = id;
        resField = String(field);
        resVal = val;
      },
      'id-123',
      'name'
    );
    handler({ target: { value: 'John' } });
    expect(resId).toBe('id-123');
    expect(resField).toBe('name');
    expect(resVal).toBe('John');
  });
});