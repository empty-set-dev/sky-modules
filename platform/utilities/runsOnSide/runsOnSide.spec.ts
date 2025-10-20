import { describe, it, expect } from 'vitest'
import runsOnSide, { runsOnServerSide, runsOnClientSide } from './runsOnSide'

describe('runsOnSide', () => {
    it('should detect server side when window is undefined', () => {
        expect(runsOnSide).toBe('server')
        expect(runsOnServerSide).toBe(true)
        expect(runsOnClientSide).toBe(false)
    })

    it('should have consistent values', () => {
        expect(runsOnServerSide).toBe(runsOnSide === 'server')
        expect(runsOnClientSide).toBe(runsOnSide === 'client')
    })

    it('should be either server or client', () => {
        expect(['server', 'client']).toContain(runsOnSide)
    })
})
