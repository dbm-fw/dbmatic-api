// File: src/measurement-normalizers.ts
import type {
  IEntryDeviceMeasurement,
  IMeasurementMeasurementValue,
  IMeasurementPosition,
  IMeasurementNumeric,
  IMeasurementFuelConsumption,
  IMeasurementSpatialAxes,
  IMeasurementSubsurface,
  IMeasurementSpeedlog,
  IMeasurementTrawlTension,
  IMeasurementWeather
} from '@poseidat/schemas';

export function isPositionValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'POSITION'; position: IMeasurementPosition } {
  return v?.type === 'POSITION' && !!v.position;
}

export function isNumericValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & {
  type:
    | 'TEMPERATURE' | 'PRESSURE' | 'VOLTAGE' | 'CURRENT' | 'POWER' | 'SPEED' | 'RPM'
    | 'FORCE' | 'HUMIDITY' | 'ENERGY_CONSUMPTION' | 'ACCELERATION' | 'ANGULAR_VELOCITY'
    | 'DEPTH' | 'ONOFF' | 'MAGNETISM';
  numeric: IMeasurementNumeric;
} {
  return !!v?.numeric;
}

export function isFuelConsumptionValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'FUEL_CONSUMPTION'; fuel_consumption: IMeasurementFuelConsumption } {
  return v?.type === 'FUEL_CONSUMPTION' && !!v.fuel_consumption;
}

export function isSpatialAxesValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'SPATIAL_AXES'; spatial_axes: IMeasurementSpatialAxes } {
  return v?.type === 'SPATIAL_AXES' && !!v.spatial_axes;
}

export function isSubsurfaceValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'SUBSURFACE'; subsurface: IMeasurementSubsurface } {
  return v?.type === 'SUBSURFACE' && !!v.subsurface;
}

export function isSpeedlogValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'SPEEDLOG'; speedlog: IMeasurementSpeedlog } {
  return v?.type === 'SPEEDLOG' && !!v.speedlog;
}

export function isTrawlTensionValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'TRAWL_TENSION'; trawl_tension: IMeasurementTrawlTension } {
  return v?.type === 'TRAWL_TENSION' && !!v.trawl_tension;
}

export function isWeatherValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'WEATHER'; weather: IMeasurementWeather } {
  return v?.type === 'WEATHER' && !!v.weather;
}

export function isScaleValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'SCALE' } {
  return v?.type === 'SCALE' && !!v.scale;
}

export function isRouteValue(
  v: IMeasurementMeasurementValue
): v is IMeasurementMeasurementValue & { type: 'ROUTE' } {
  return v?.type === 'ROUTE';
}

export type NormalizedMeasurement =
  | { kind: 'POSITION'; entry: IEntryDeviceMeasurement; payload: IMeasurementPosition }
  | { kind: 'NUMERIC'; entry: IEntryDeviceMeasurement; payload: { value: number; unit?: string; rawType?: string } }
  | { kind: 'FUEL_CONSUMPTION'; entry: IEntryDeviceMeasurement; payload: IMeasurementFuelConsumption }
  | { kind: 'SPATIAL_AXES'; entry: IEntryDeviceMeasurement; payload: IMeasurementSpatialAxes }
  | { kind: 'SUBSURFACE'; entry: IEntryDeviceMeasurement; payload: IMeasurementSubsurface }
  | { kind: 'SPEEDLOG'; entry: IEntryDeviceMeasurement; payload: IMeasurementSpeedlog }
  | { kind: 'TRAWL_TENSION'; entry: IEntryDeviceMeasurement; payload: IMeasurementTrawlTension }
  | { kind: 'WEATHER'; entry: IEntryDeviceMeasurement; payload: IMeasurementWeather }
  | { kind: 'SCALE'; entry: IEntryDeviceMeasurement; payload: NonNullable<IEntryDeviceMeasurement['value']['scale']> }
  | { kind: 'ROUTE'; entry: IEntryDeviceMeasurement; payload: unknown }
  | { kind: 'UNKNOWN'; entry: IEntryDeviceMeasurement; payload: unknown };

export function normalizeMeasurement(m: IEntryDeviceMeasurement): NormalizedMeasurement {
  const v = m.value;
  if (!v) return { kind: 'UNKNOWN', entry: m, payload: undefined };

  if (isPositionValue(v)) return { kind: 'POSITION', entry: m, payload: v.position };
  if (isFuelConsumptionValue(v)) return { kind: 'FUEL_CONSUMPTION', entry: m, payload: v.fuel_consumption };
  if (isSpatialAxesValue(v)) return { kind: 'SPATIAL_AXES', entry: m, payload: v.spatial_axes };
  if (isSubsurfaceValue(v)) return { kind: 'SUBSURFACE', entry: m, payload: v.subsurface };
  if (isSpeedlogValue(v)) return { kind: 'SPEEDLOG', entry: m, payload: v.speedlog };
  if (isTrawlTensionValue(v)) return { kind: 'TRAWL_TENSION', entry: m, payload: v.trawl_tension };
  if (isWeatherValue(v)) return { kind: 'WEATHER', entry: m, payload: v.weather };
  if (isScaleValue(v)) return { kind: 'SCALE', entry: m, payload: v.scale! };
  if (isRouteValue(v)) return { kind: 'ROUTE', entry: m, payload: v };

  if (isNumericValue(v)) {
    const unit = guessUnitFromType(v.type);
    return { kind: 'NUMERIC', entry: m, payload: { value: v.numeric.value, unit, rawType: v.type } };
  }

  return { kind: 'UNKNOWN', entry: m, payload: v };
}

export function guessUnitFromType(t: NonNullable<IMeasurementMeasurementValue['type']> | undefined) {
  switch (t) {
    case 'RPM': return 'rpm';
    case 'TEMPERATURE': return '°C';
    case 'PRESSURE': return 'bar';
    case 'SPEED': return 'm/s';          // adjust if your devices report knots
    case 'VOLTAGE': return 'V';
    case 'CURRENT': return 'A';
    case 'POWER': return 'kW';
    case 'HUMIDITY': return '%';
    case 'DEPTH': return 'm';
    case 'ENERGY_CONSUMPTION': return 'kWh';
    case 'ACCELERATION': return 'm/s²';
    case 'ANGULAR_VELOCITY': return '°/s';
    default: return undefined;
  }
}
