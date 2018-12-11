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
describe('test store', () => {
  const store = getStore()
  describe('test get', () => {
    it('getState should equal baseState, but not toBe baseState', () => {
      expect(store.getState()).toEqual(baseState)
      expect(store.getState()).not.toBe(baseState)
    })
    it('get num', () => {
      expect(store.get('num')).toBe(baseState.num)
      expect(store.get('arr')).toBe(baseState.arr)
      expect(store.get('bool')).toBe(baseState.bool)
      expect(store.get('chain')).toBe(baseState.chain)
    })
    it('get chain', () => {
      expect(store.get('chain.a')).toBe(baseState.chain.a)
    })
    it('get a undefined chain, should not change state when defaultValue is undefined', () => {
      expect(store.get('a.b.c.d')).toBe(undefined)
      expect(store.getState()).toEqual(baseState)
    })
    it('should set defaultValue when return value and defaultValue is not undefined', () => {
      const defaultValue = 'default value for a.b.c.d'
      expect(store.get('default', defaultValue)).toEqual(defaultValue)
      const a = {
        b: {
          c: {
            d: defaultValue
          }
        }
      }
      expect(store.get('a.b.c.d', defaultValue)).toBe(defaultValue)
      expect(store.get('a')).toEqual(a)
      expect(store.getState()).toMatchObject({
        a
      })
      expect((store as any).hadSetDefaultValue).toEqual(['default', 'a.b.c.d'])
      expect(
        (store as any).shouldSetDefault('a.b.c.d', undefined, 1)
      ).toBeFalsy()
    })
  })
  describe('test set', () => {
    it('set a value', () => {
      const newKey = {
        chain: 10
      }
      store.set('newKey', newKey)
      expect(store.get('newKey')).toBe(newKey)
    })
    it('set chain', () => {
      store.set('z.w.i.n.g', 'zwing')
      expect(store.get('z.w.i.n.g')).toEqual('zwing')
      expect(store.get('z')).toEqual({
        w: {
          i: {
            n: {
              g: 'zwing'
            }
          }
        }
      })
    })
  })
})
describe('replace state', () => {
  const store = getStore()
  const newState = {
    num: '',
    arr: '',
    bool: '',
    chain: {
    }
  }
  it('should replace state like React.setState', () => {
    expect(store.getState()).toMatchObject(baseState)
    expect(store.get('num')).toEqual(baseState.num)
    store.replace(newState)
    expect(store.getState()).toMatchObject(newState)
    expect(store.get('num')).toEqual('')
  })
})
