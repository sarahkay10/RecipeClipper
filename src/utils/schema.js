import * as self from './schema';

const longestStringIn = (strArray) => strArray.reduce((max, match) => (match.length > max.length ? match : max), '');

export const getRecipeSchemasFromDocument = () => {
  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((schema) => {
      try {
        return JSON.parse(schema.innerText);
      } catch (e) {
        // Do nothing
      }

      return null;
    })
    .filter((e) => e);

  const recipeSchemas = schemas.map((schema) => {
    if (schema['@graph']) {
      return schema['@graph'].find((subSchema) => subSchema['@type'] === 'Recipe');
    }

    if (schema['@type'] === 'Recipe') return schema;

    return null;
  }).filter((e) => e);

  return recipeSchemas;
};

let schemas;
export const getPropertyFromSchema = (propName) => {
  if (!schemas) schemas = self.getRecipeSchemasFromDocument();

  const foundSchema = schemas.find((schema) => schema[propName]) || {};

  return foundSchema[propName] || null;
};

export const getImageSrcFromSchema = () => {
  const images = self.getPropertyFromSchema('image');
  if (!images) return '';

  if (typeof images === 'string') return images;
  if (typeof images[0] === 'string') return images[0];

  return '';
};

export const getTitleFromSchema = () => {
  const title = self.getPropertyFromSchema('name');

  if (typeof title === 'string') return title;

  return '';
};

export const getDescriptionFromSchema = () => {
  const description = self.getPropertyFromSchema('description');

  if (typeof description === 'string') return description;

  return '';
};

export const getYieldFromSchema = () => {
  const recipeYield = self.getPropertyFromSchema('recipeYield');
  if (!recipeYield) return '';

  if (typeof recipeYield === 'string') return recipeYield;
  if (typeof recipeYield[0] === 'string') return longestStringIn(recipeYield);

  return '';
};

export const getInstructionsFromSchema = () => {
  const instructions = self.getPropertyFromSchema('recipeInstructions');
  if (!instructions) return '';

  if (typeof instructions === 'string') return instructions;
  if (typeof instructions[0] === 'string') return instructions.join('\n');
  if (instructions[0] && typeof instructions[0].text === 'string') {
    return instructions.map((instruction) => instruction.text).join('\n');
  }

  return '';
};

export const getIngredientsFromSchema = () => {
  const ingredients = self.getPropertyFromSchema('recipeIngredient');
  if (!ingredients) return '';

  if (typeof ingredients === 'string') return ingredients;
  if (typeof ingredients[0] === 'string') return ingredients.join('\n');
  if (ingredients[0] && typeof ingredients[0].text === 'string') {
    return ingredients.map((ingredient) => ingredient.text).join('\n');
  }

  return '';
};