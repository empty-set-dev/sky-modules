import 'standard/Time'

test('standard Time', () => {
    expect(Time(100 * minutes).seconds).toBe(6000)
})
