function slugify(str) {
  // https://gist.github.com/codeguy/6684588
  str = str.replace(/^\s+|\s+$/g, '');  // Trim
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9 -]/g, '')  // Remove invalid chars
        .replace(/\s+/g, '-')  // Collapse whitespace and replace with `-`
        .replace(/-+/g, '-');  // Collapse dashes

  return str;
}

export function getProductDetailPath(id, name) {
  const nameSlug = slugify(name);
  return `/products/${id}/${nameSlug}`;
}

export function getProductImagePath(id, name) {
  const nameSlug = slugify(name);
  return `/product-images/${id}-${nameSlug}.jpg`;
}
