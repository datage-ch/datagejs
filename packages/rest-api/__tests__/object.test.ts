import { setIn, getIn, splitPath } from '../src'

describe('rest-api', () => {
  describe('object', () => {
    describe('setIn', () => {
      test('assign value to object', () => {
        const obj = { a: 1, b: 2 }
        const result = setIn(obj, ['a'], 2)
        expect(result).toEqual({ a: 2, b: 2 })
      })

      test('assign value to class', () => {
        class Test {
          public a: number = 1
          public b: number = 2
        }
        const obj = new Test()
        const result = setIn(obj, ['a'], 2)
        expect(result).toEqual({ a: 2, b: 2 })
      })

      test('assign value to subobject', () => {
        const obj = { a: 1, b: { a: 1, b: 2 } }
        const result = setIn(obj, ['b', 'b'], 5)
        expect(result).toEqual({ a: 1, b: { a: 1, b: 5 } })
      })

      test('assign value to subobject in array', () => {
        const obj = { a: 1, b: { a: 1, b: [{ a: 1, b: 2 }] } }
        const result = setIn(obj, ['b', 'b', 0, 'b'], 5)
        expect(result).toEqual({ a: 1, b: { a: 1, b: [{ a: 1, b: 5 }] } })
      })

      test('assign value to object which is an array', () => {
        const obj = [{ a: 1, b: 2 }]
        const result = setIn(obj, [0, 'a'], 2)
        expect(result).toEqual([{ a: 2, b: 2 }])
      })

      test('assign value to object which is an array multiple entries', () => {
        const obj = [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
        ]
        const result = setIn(obj, [3, 'a'], 2)
        expect(result).toEqual([
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 2, b: 2 },
          { a: 1, b: 2 },
        ])
      })

      test('set empty object', () => {
        const obj = {}
        const result = setIn(obj, ['a', 'b'], 2)
        expect(result).toEqual({
          a: {
            b: 2,
          },
        })
      })

      test('set empty array', () => {
        const obj = {}
        const result = setIn(obj, ['a', 0, 'b'], 2)
        expect(result).toEqual({
          a: [
            {
              b: 2,
            },
          ],
        })
      })

      test('more complex structure', () => {
        const obj = {
          x: [
            { a: 1, b: 2 },
            { a: 1, b: 2, c: 3, d: 4 },
            { a: 1, b: 2 },
            { a: 1, b: 2, x: 100, y: [{ d: 6 }] },
            { a: 1, b: 2 },
          ],
        }
        const result = setIn(obj, ['x', 3, 'y', 0, 'f'], { g: 10 })
        expect(result).toEqual({
          x: [
            { a: 1, b: 2 },
            { a: 1, b: 2, c: 3, d: 4 },
            { a: 1, b: 2 },
            { a: 1, b: 2, x: 100, y: [{ d: 6, f: { g: 10 } }] },
            { a: 1, b: 2 },
          ],
        })
      })

      test('replace object', () => {
        const obj = {
          x: [
            { a: 1, b: 2 },
            { a: 1, b: 2, c: 3, d: 4 },
            { a: 1, b: 2 },
            { a: 1, b: 2, x: 100, y: [{ d: 6 }] },
            { a: 1, b: 2 },
          ],
        }
        const result = setIn(obj, ['x'], { g: 10 })
        expect(result).toEqual({
          x: { g: 10 },
        })
      })

      test('replace array', () => {
        const obj = {
          x: [
            { a: 1, b: 2 },
            { a: 1, b: 2, c: 3, d: 4 },
            { a: 1, b: 2 },
            { a: 1, b: 2, x: 100, y: [{ d: 6 }] },
            { a: 1, b: 2 },
          ],
        }
        const result = setIn(obj, ['x', 3], { g: 10 })
        expect(result).toEqual({
          x: [{ a: 1, b: 2 }, { a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 2 }, { g: 10 }, { a: 1, b: 2 }],
        })
      })
    })

    describe('gitIn', () => {
      test('check fetching classes from array', () => {
        class Test {
          public a: number = 1
          public b: number = 2
        }
        const obj = new Test()
        const result = getIn<Test, Test[]>([obj, obj, obj], [1])
        expect(result).toEqual(obj)
      })

      test('check fetching classes from object', () => {
        class Test {
          public a: number = 1
          public b: number = 2
        }
        const obj = new Test()
        const result = getIn<Test, { test: Test }>({ test: obj }, ['test'])
        expect(result).toEqual(obj)
      })
    })

    describe('splitPath', () => {
      test('check path split results', () => {
        expect(splitPath('a')).toEqual(['a'])
        expect(splitPath('a.b')).toEqual(['a', 'b'])
        expect(splitPath('a.asd2342sdf.asdf')).toEqual(['a', 'asd2342sdf', 'asdf'])
        expect(splitPath('a.123.b')).toEqual(['a', 123, 'b'])
        expect(splitPath('a.0.b')).toEqual(['a', 0, 'b'])
        expect(splitPath('adfs.0.1.2.3.4')).toEqual(['adfs', 0, 1, 2, 3, 4])
        expect(splitPath('1')).toEqual([1])
      })
    })
  })
})
