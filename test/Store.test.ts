import Store from '../src/store'

describe('test init a empty store', () => {
  it('initState is {}', () => {
    const store = new Store()
    expect(store.getState()).toEqual({})
  })
})

const baseState = {
  num: 1,
  arr: [1, 2, 3],
  bool: true,
  chain: {
    a: 'a'
  }
}

function getStore() {
  return new Store<typeof baseState>(baseState)
}
describe('test get', () => {
  const store = getStore()
  it('getState should equal baseState, but not toBe baseState', () => {
    expect(store.getState()).toEqual(baseState)
    expect(store.getState()).not.toBe(baseState)
  })
  it('get num', () => {
    expect(store.get('num')).toBe(baseState.num)
    expect(store.get('arr')).toBe(baseState.arr)
    expect(store.get('bool')).toBe(baseState.bool)
    expect(store.get('chain')).toEqual(baseState.chain)
  })
  it('get chain', () => {
    expect(store.get('chain.a')).toBe(baseState.chain.a)
  })
  it('get a chain will init object', () => {
    expect(store.get('a.b.c.d')).toBe(undefined)
    expect((store.getState() as any).a).toEqual({
      b: { c: { d: undefined } }
    })
  })
  it('get chain with a defaultValue', () => {
    const defaultValue = 'default value for a.b.c.d'
    expect(store.get('default', defaultValue)).toEqual(defaultValue)
    const e = {
      f: defaultValue
    }
    expect(store.get('e.f', defaultValue)).toBe(defaultValue)
    expect(store.get('e')).toEqual(e)
    expect(store.getState()).toMatchObject({
      e
    })
    // expect((store as any).hadSetDefaultValue).toEqual(['default', 'a.b.c.d'])
    // expect((store as any).shouldSetDefault('a.b.c.d', undefined, 1)).toBeFalsy()
  })
})
describe('test set', () => {
  const store = getStore()
  it('set a value', () => {
    const newKey = {
      chain: 10
    }
    store.set('newKey', newKey)
    expect(store.get('newKey')).toBe(newKey)
  })
  it('set chain', () => {
    const z = {
      w: {
        i: {
          n: {
            g: 'zwing'
          }
        }
      }
    }
    store.set('z.w.i.n.g', 'zwing')
    expect(store.get('z.w.i.n.g')).toEqual(z.w.i.n.g)
    expect(store.get('z')).toEqual(z)
    expect(store.get('z.w.i')).toEqual(z.w.i)
  })
})
describe('replace state', () => {
  const store = getStore()
  const newState = {
    num: '',
    arr: '',
    bool: '',
    chain: {
      b: {
        c: 1
      }
    }
  }
  it('should replace state like React.setState', () => {
    expect(store.getState()).toMatchObject(baseState)
    expect(store.get('num')).toEqual(baseState.num)
    store.replace(newState)
    expect(store.getState()).toMatchObject(newState)
    expect(store.get('num')).toEqual('')
    expect(store.get('chain.b')).toEqual({
      c: 1
    })
    store.set('chain.b.c', 2333)
    expect(store.get('chain.b.c')).toEqual(2333)
  })
})
