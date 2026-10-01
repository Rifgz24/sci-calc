export type UnitCategory = 'length' | 'area' | 'volume' | 'mass' | 'force' | 'pressure' | 'energy' | 'temperature' | 'speed' | 'time'

type UnitConverter = { [unit: string]: (value: number) => number }
type UnitDefinition = { toBase: UnitConverter; fromBase: UnitConverter }

const converters: { [category in UnitCategory]: UnitDefinition } = {
  length: { toBase: { mm: v => v / 1000, cm: v => v / 100, m: v => v, km: v => v * 1000, in: v => v * 0.0254, ft: v => v * 0.3048, yd: v => v * 0.9144, mile: v => v * 1609.344 }, fromBase: { mm: v => v * 1000, cm: v => v * 100, m: v => v, km: v => v / 1000, in: v => v / 0.0254, ft: v => v / 0.3048, yd: v => v / 0.9144, mile: v => v / 1609.344 } },
  area: { toBase: { mm2: v => v / 1e6, cm2: v => v / 1e4, m2: v => v, in2: v => v * 6.4516e-4, ft2: v => v * 0.092903 }, fromBase: { mm2: v => v * 1e6, cm2: v => v * 1e4, m2: v => v, in2: v => v / 6.4516e-4, ft2: v => v / 0.092903 } },
  volume: { toBase: { mL: v => v / 1000, L: v => v, cm3: v => v / 1000, m3: v => v * 1000, in3: v => v * 0.0163871, ft3: v => v * 28.3168 }, fromBase: { mL: v => v * 1000, L: v => v, cm3: v => v * 1000, m3: v => v / 1000, in3: v => v / 0.0163871, ft3: v => v / 28.3168 } },
  mass: { toBase: { mg: v => v / 1e6, g: v => v / 1000, kg: v => v, ton: v => v * 1000, oz: v => v * 0.0283495, lb: v => v * 0.453592 }, fromBase: { mg: v => v * 1e6, g: v => v * 1000, kg: v => v, ton: v => v / 1000, oz: v => v / 0.0283495, lb: v => v / 0.453592 } },
  force: { toBase: { N: v => v, kN: v => v * 1000, dyn: v => v * 1e-5, lbf: v => v * 4.44822, kgf: v => v * 9.80665 }, fromBase: { N: v => v, kN: v => v / 1000, dyn: v => v / 1e-5, lbf: v => v / 4.44822, kgf: v => v / 9.80665 } },
  pressure: { toBase: { Pa: v => v, kPa: v => v * 1000, MPa: v => v * 1e6, bar: v => v * 1e5, atm: v => v * 101325, psi: v => v * 6894.76 }, fromBase: { Pa: v => v, kPa: v => v / 1000, MPa: v => v / 1e6, bar: v => v / 1e5, atm: v => v / 101325, psi: v => v / 6894.76 } },
  energy: { toBase: { J: v => v, kJ: v => v * 1000, cal: v => v * 4.184, kcal: v => v * 4184, Wh: v => v * 3600, kWh: v => v * 3.6e6 }, fromBase: { J: v => v, kJ: v => v / 1000, cal: v => v / 4.184, kcal: v => v / 4184, Wh: v => v / 3600, kWh: v => v / 3.6e6 } },
  temperature: { toBase: { C: v => v + 273.15, K: v => v, F: v => (v - 32) * 5 / 9 + 273.15 }, fromBase: { C: v => v - 273.15, K: v => v, F: v => (v - 273.15) * 9 / 5 + 32 } },
  speed: { toBase: { 'm/s': v => v, 'km/h': v => v / 3.6, mph: v => v * 0.44704, 'ft/s': v => v * 0.3048 }, fromBase: { 'm/s': v => v, 'km/h': v => v * 3.6, mph: v => v / 0.44704, 'ft/s': v => v / 0.3048 } },
  time: { toBase: { ms: v => v / 1000, s: v => v, min: v => v * 60, h: v => v * 3600, day: v => v * 86400 }, fromBase: { ms: v => v * 1000, s: v => v, min: v => v / 60, h: v => v / 3600, day: v => v / 86400 } }
}

export const units: { [category in UnitCategory]: string[] } = {
  length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mile'], area: ['mm2', 'cm2', 'm2', 'in2', 'ft2'], volume: ['mL', 'L', 'cm3', 'm3', 'in3', 'ft3'], mass: ['mg', 'g', 'kg', 'ton', 'oz', 'lb'], force: ['N', 'kN', 'dyn', 'lbf', 'kgf'], pressure: ['Pa', 'kPa', 'MPa', 'bar', 'atm', 'psi'], energy: ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh'], temperature: ['C', 'K', 'F'], speed: ['m/s', 'km/h', 'mph', 'ft/s'], time: ['ms', 's', 'min', 'h', 'day']
}

export function convertUnit(value: number, category: UnitCategory, from: string, to: string): number {
  const converter = converters[category]
  if (!Number.isFinite(value) || !converter.toBase[from] || !converter.fromBase[to]) throw new Error('Invalid unit conversion')
  const result = converter.fromBase[to](converter.toBase[from](value))
  if (!Number.isFinite(result)) throw new Error('Conversion overflow')
  return result
}
