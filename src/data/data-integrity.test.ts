import { describe, expect, it } from 'vitest';
import sponsors from './sponsors.json';
import apps from './apps.json';
import { DEVICE_DATA } from '@/components/portable-catalog/data';
import type { DeviceCategory } from '@/components/portable-catalog/types';

/* ── sponsors.json ───────────────────────────────── */

describe('sponsors.json', () => {
  it('has a non-empty supporters array', () => {
    expect(sponsors.supporters.length).toBeGreaterThan(0);
  });

  it('has a non-empty sponsors array', () => {
    expect(sponsors.sponsors.length).toBeGreaterThan(0);
  });

  it('every supporter has a name and a valid URL', () => {
    for (const entry of sponsors.supporters) {
      expect(entry.name).toBeTruthy();
      expect(typeof entry.name).toBe('string');
      expect(() => new URL(entry.url)).not.toThrow();
    }
  });

  it('every sponsor has a name and a valid URL', () => {
    for (const entry of sponsors.sponsors) {
      expect(entry.name).toBeTruthy();
      expect(typeof entry.name).toBe('string');
      expect(() => new URL(entry.url)).not.toThrow();
    }
  });
});

/* ── apps.json ───────────────────────────────────── */

describe('apps.json', () => {
  it('has a non-empty items array', () => {
    expect(apps.items.length).toBeGreaterThan(0);
  });

  it('every item has required fields', () => {
    for (const item of apps.items) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.linkKey).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });
});

/* ── DEVICE_DATA ─────────────────────────────────── */

describe('DEVICE_DATA', () => {
  const categories: DeviceCategory[] = ['universal', 'solar', 'boards'];

  it('every category has at least 1 device', () => {
    for (const category of categories) {
      expect(DEVICE_DATA[category].length).toBeGreaterThan(0);
    }
  });

  it('every device has required fields', () => {
    for (const category of categories) {
      for (const device of DEVICE_DATA[category]) {
        expect(device.title).toBeTruthy();
        expect(device.image).toBeTruthy();
        expect(device.price).toBeTruthy();
        expect(device.href).toBeTruthy();
        expect(device.tech).toBeTruthy();
      }
    }
  });

  it('tech is always "NRF" or "ESP"', () => {
    for (const category of categories) {
      for (const device of DEVICE_DATA[category]) {
        expect(['NRF', 'ESP']).toContain(device.tech);
      }
    }
  });

  it('descriptionLines is a tuple of 2 non-empty strings', () => {
    for (const category of categories) {
      for (const device of DEVICE_DATA[category]) {
        expect(device.descriptionLines).toHaveLength(2);
        expect(device.descriptionLines[0]).toBeTruthy();
        expect(device.descriptionLines[1]).toBeTruthy();
      }
    }
  });

  it('every device has a non-empty alt text', () => {
    for (const category of categories) {
      for (const device of DEVICE_DATA[category]) {
        expect(device.alt).toBeTruthy();
      }
    }
  });

  it('every device has a badges array', () => {
    for (const category of categories) {
      for (const device of DEVICE_DATA[category]) {
        expect(Array.isArray(device.badges)).toBe(true);
        expect(device.badges.length).toBeGreaterThan(0);
      }
    }
  });
});
