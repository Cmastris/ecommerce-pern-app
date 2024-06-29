/**
 * Returns a URL slug representation of the provided string.
 *
 * @remarks
 * "Slugifying" involves trimming whitespace, converting to lowercase,
 * and replacing spaces between words with dashes.
 *
 * @privateremarks
 * Based on https://gist.github.com/codeguy/6684588.
 * 
 * @example
 * `slugify(" The 1st   input string!")` returns `the-1st-input-string`.
 * 
 * @param str - The string to represent in URL slug format
 * @returns A URL slug string representation of `str`
 */
function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, '');  // Trim
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9 -]/g, '')  // Remove invalid chars
        .replace(/\s+/g, '-')  // Collapse whitespace and replace with `-`
        .replace(/-+/g, '-');  // Collapse dashes

  return str;
}


/**
 * Returns a product's detail page URL path, generated using the provided product ID & name.
 * 
 * @param id - The product's ID
 * @param name - The product's name
 * @returns A product's detail page URL path, including the "slugified" product name
 */
export function getProductDetailPath(id: number | string, name: string) {
  const nameSlug = slugify(name);
  return `/products/${id}/${nameSlug}`;
}


/**
 * Returns a product's image URL path, generated using the provided product ID & name.
 * 
 * @param id - The product's ID
 * @param name - The product's name
 * @returns A product's image URL path, including the "slugified" product name
 */
export function getProductImagePath(id: number | string, name: string) {
  const nameSlug = slugify(name);
  return `/product-images/${id}-${nameSlug}.jpg`;
}
