/**
 * Utility functions to generate dynamic class names and field IDs
 * This helps discourage scraping by randomizing class names based on the current day
 */

// Get a seed value based on the current day (changes daily)
const getSeed = () => {
  const date = new Date();
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
};

// Generate a pseudo-random string based on input and seed
const generateHash = (input, seed = getSeed()) => {
  const baseStr = input + seed.toString();
  let hash = 0;
  for (let i = 0; i < baseStr.length; i++) {
    const char = baseStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
};

// Generate a dynamic class name based on a semantic name
export const dynamicClass = (semanticName) => {
  return `c_${generateHash(semanticName)}`;
};

// Generate a dynamic ID for form fields
export const dynamicId = (fieldName) => {
  return `f_${generateHash(fieldName)}`;
};

// Generate a dynamic attribute name
export const dynamicAttr = (attrName) => {
  return `a_${generateHash(attrName)}`;
};

// Helper to combine multiple dynamic classes
export const combineClasses = (...classNames) => {
  return classNames.map(name => dynamicClass(name)).join(' ');
};

// Mapping of common tailwind classes to their dynamic equivalents (for frequently used classes)
const commonClassMap = {};

// Get dynamic class for commonly used Tailwind classes
export const getTailwindClass = (className) => {
  if (!commonClassMap[className]) {
    commonClassMap[className] = dynamicClass(className);
  }
  return commonClassMap[className];
}; 