/**
 * Property-Based Tests for TinyLink Utilities
 * Feature: tinylink-url-shortener
 * Using fast-check for property-based testing
 */

import * as fc from 'fast-check'
import { generateShortCode, isValidUrl, formatUrl } from '../lib/utils'

describe('Utility Functions - Property-Based Tests', () => {
  /**
   * Feature: tinylink-url-shortener, Property 19: Generated codes exclude confusing characters
   * Validates: Requirements 10.3
   */
  describe('Property 19: Generated codes exclude confusing characters', () => {
    it('should never generate codes containing 0, O, l, or I', () => {
      fc.assert(
        fc.property(fc.integer({ min: 4, max: 12 }), (length) => {
          const code = generateShortCode(length)
          const confusingChars = ['0', 'O', 'l', 'I']
          
          // Code should not contain any confusing characters
          for (const char of confusingChars) {
            expect(code).not.toContain(char)
          }
          
          // Code should have the correct length
          expect(code.length).toBe(length)
          
          // Code should only contain allowed characters
          expect(code).toMatch(/^[abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/)
        }),
        { numRuns: 100 }
      )
    })

    it('should generate unique codes on repeated calls', () => {
      const codes = new Set<string>()
      const iterations = 100
      
      for (let i = 0; i < iterations; i++) {
        codes.add(generateShortCode())
      }
      
      // With 6 characters and 57 possible chars, collisions are extremely rare
      // We expect at least 95% unique codes
      expect(codes.size).toBeGreaterThan(iterations * 0.95)
    })
  })

  /**
   * Feature: tinylink-url-shortener, Property 3: URLs without protocols are normalized
   * Validates: Requirements 1.4
   */
  describe('Property 3: URLs without protocols are normalized', () => {
    it('should prepend https:// to URLs without protocol', () => {
      fc.assert(
        fc.property(
          fc.domain(),
          (domain) => {
            const urlWithoutProtocol = domain
            const formatted = formatUrl(urlWithoutProtocol)
            
            expect(formatted).toMatch(/^https?:\/\//)
            expect(formatted).toBe(`https://${domain}`)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not modify URLs that already have http:// or https://', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (url) => {
            const formatted = formatUrl(url)
            expect(formatted).toBe(url)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Feature: tinylink-url-shortener, Property 4: Invalid URLs are rejected
   * Validates: Requirements 1.5, 8.1
   */
  describe('Property 4: Invalid URLs are rejected', () => {
    it('should reject URLs without valid protocol', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (str) => {
            // Skip if string happens to be a valid URL
            if (str.startsWith('http://') || str.startsWith('https://')) {
              return true
            }
            
            const result = isValidUrl(str)
            expect(result).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should accept valid HTTP and HTTPS URLs', () => {
      fc.assert(
        fc.property(
          fc.webUrl({ validSchemes: ['http', 'https'] }),
          (url) => {
            const result = isValidUrl(url)
            expect(result).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject URLs with invalid protocols', () => {
      const invalidProtocols = ['ftp', 'file', 'mailto', 'tel', 'data']
      
      invalidProtocols.forEach(protocol => {
        const url = `${protocol}://example.com`
        expect(isValidUrl(url)).toBe(false)
      })
    })
  })

  /**
   * Feature: tinylink-url-shortener, Property 14: Only valid protocols are accepted
   * Validates: Requirements 8.1
   */
  describe('Property 14: Only valid protocols are accepted', () => {
    it('should only accept http and https protocols', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('http'),
            fc.constant('https')
          ),
          fc.domain(),
          (protocol, domain) => {
            const url = `${protocol}://${domain}`
            expect(isValidUrl(url)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
