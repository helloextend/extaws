import { ExtAws } from './index'

describe('ExtAws', () => {
    it('Should have initial properties', () => {
        const auth = new ExtAws()
        expect(auth.assertion).toBe('')
    })
})
