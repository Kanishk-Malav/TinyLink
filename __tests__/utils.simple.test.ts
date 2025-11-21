/**
 * Unit Tests for TinyLink Utilities
 * Feature: tinylink-url-shortener
 */

import { generateShortCode, isValidUrl, formatUrl } from '../lib/utils'

describe('Utility Functions - Unit Tests', () => {
  describe('generateShortCode', () => {
    it('should generate code of default length 6', () => {
      const code = generateShortCode()
      expect(code).toHaveLength(6)
    })

    it('should generate code of specified length', () => {
      const code = generateShortCode(10)
      expect(code).toHaveLength(10)
    })

    it('should not contain confusing characters (0, O, l, I)', () => {
      const iterations = 100
      for (let i = 0; i < iterations; i++) {
        const code = generateShortCode()
        expect(code).not.toMatch(/[0OlI]/)
      }
    })

    it('should only contain allowed characters', () => {
      const code = generateShortCode()
      expect(code).toMatch(/^[abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/)
    })

    it('should generate different codes on repeated calls', () => {
      const codes = new Set()
      for (let i = 0; i < 50; i++) {
        codes.add(generateShortCode())
      }
      // Should have high uniqueness (at least 45 out of 50)
      expect(codes.size).toBeGreaterThan(45)
    })
  })

  describe('isValidUrl', () => {
    it('should accept valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
      expect(isValidUrl('http://www.example.com')).toBe(true)
      expect(isValidUrl('http://example.com/path')).toBe(true)
      expect(isValidUrl('http://example.com:8080')).toBe(true)
    })

    it('should accept valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('https://www.example.com')).toBe(true)
      expect(isValidUrl('https://example.com/path')).toBe(true)
      expect(isValidUrl('https://example.com:443')).toBe(true)
    })

    it('should reject URLs without protocol', () => {
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('www.example.com')).toBe(false)
    })

    it('should reject invalid protocols', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false)
      expect(isValidUrl('file://example.com')).toBe(false)
      expect(isValidUrl('mailto:test@example.com')).toBe(false)
    })

    it('should reject invalid strings', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('   ')).toBe(false)
    })
  })

  describe('formatUrl', () => {
    it('should prepend https:// to URLs without protocol', () => {
      expect(formatUrl('example.com')).toBe('https://example.com')
      expect(formatUrl('www.example.com')).toBe('https://www.example.com')
      expect(formatUrl('example.com/path')).toBe('https://example.com/path')
    })

    it('should not modify URLs with http://', () => {
      const url = 'http://example.com'
      expect(formatUrl(url)).toBe(url)
    })

    it('should not modify URLs with https://', () => {
      const url = 'https://example.com'
      expect(formatUrl(url)).toBe(url)
    })

    it('should handle URLs with paths and query strings', () => {
      expect(formatUrl('example.com/path?query=value')).toBe('https://example.com/path?query=value')
      expect(formatUrl('http://example.com/path?query=value')).toBe('http://example.com/path?query=value')
    })
  })

  describe('Integration: formatUrl + isValidUrl', () => {
    it('should make invalid URLs valid by adding protocol', () => {
      const urlWithoutProtocol = 'example.com'
      expect(isValidUrl(urlWithoutProtocol)).toBe(false)
      
      const formatted = formatUrl(urlWithoutProtocol)
      expect(isValidUrl(formatted)).toBe(true)
    })

    it('should work with various domain formats', () => {
      const domains = [
        'example.com',
        'www.example.com',
        'subdomain.example.com',
        'example.co.uk',
        'example.com:8080',
      ]

      domains.forEach(domain => {
        const formatted = formatUrl(domain)
        expect(isValidUrl(formatted)).toBe(true)
      })
    })
  })
})
