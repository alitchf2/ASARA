/**
 * Thresholds for natural language color comparison.
 * Based on CIELAB ΔL, ΔA, ΔB, and ΔChroma values.
 * (Task 10.6)
 */

export const LIGHTNESS_THRESHOLDS = {
  MINIMAL: 3,
  SLIGHT: 10,
  NOTICEABLE: 18,
  SIGNIFICANT: 25,
};

export const HUE_THRESHOLDS = {
  MINIMAL: 3,
  SLIGHT: 10,
  NOTICEABLE: 18,
  SIGNIFICANT: 25,
};

export const CHROMA_THRESHOLDS = {
  MINIMAL: 5,
  SLIGHT: 15,
  SIGNIFICANT: 30,
};

export const DESCRIPTORS = {
  VIRTUAL_MATCH: "virtually the same",
  SLIGHT: "slightly",
  NOTICEABLE: "noticeably",
  SIGNIFICANT: "significantly",
};
